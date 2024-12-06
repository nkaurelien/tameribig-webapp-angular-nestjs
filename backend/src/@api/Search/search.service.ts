import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {InjectModel} from '@nestjs/mongoose';
import {WriteResult} from '@google-cloud/firestore';
import {SEARCH_COLLECTION_INDEX, SEARCH_MODEL_PROVIDER} from './constants';
import {SearchSuggestion} from './search-suggestion.interface';
import {CreateSearchSuggestionDto} from './dto/create-search-suggestion.dto';
import {ImagesMongodbService} from '@api/MediaImages/images-mongodb.service';

// import {CreateCustomerDto} from './dto/create-Customer.dto';

@Injectable()
export class SearchService {
    private firestore: admin.firestore.Firestore;
    private fireCollection: admin.firestore.CollectionReference;

    constructor(
        @InjectModel(SEARCH_MODEL_PROVIDER)
        private readonly SearchSuggestionModel: Model<SearchSuggestion>,
        private readonly imagesService: ImagesMongodbService,
    ) {
        this.firestore = admin.firestore();
        this.fireCollection = this.firestore.collection(SEARCH_COLLECTION_INDEX);
    }

    async createSuggestion(data: CreateSearchSuggestionDto, syncToFirebase = false): Promise<SearchSuggestion | WriteResult> {

        // Mongo DB
        const item = new this.SearchSuggestionModel(data);
        await item.save((err, record) => {
            if (err) {
                return;
            }
            if (syncToFirebase) {
                // Firebase
                const obj = record.toJSON();
                const ref = obj._id;
                delete obj._id;
                this.fireCollection.doc(`${ref}`).set(obj);
            }
        });

        return item;
    }

    async findOneOrcreateSuggestion(filter: Partial<CreateSearchSuggestionDto>, data: CreateSearchSuggestionDto, syncToFirebase = false): Promise<SearchSuggestion | WriteResult> {

        return await this.SearchSuggestionModel.findOneAndUpdate(
            filter, // find a document with that filter
            data, // document to insert when nothing was found
            {upsert: true, new: true, runValidators: true}, // options
            (err, record) => {
                if (err) {
                    return;
                }
                if (syncToFirebase) {
                    // Firebase
                    const obj = record.toJSON();
                    const ref = obj._id;
                    delete obj._id;
                    this.fireCollection.doc(`${ref}`).set(obj);
                }
            },
        );
    }

    async atlasFullTextSearchImages(args: string[], limit: number = 10): Promise<any[] | any> {
        return await this.imagesService.atlasFullTextSearch(args, limit);
    }

    async nativeFullTextSearchAutocompleSuggestions(search: any, limit: number = 10): Promise<SearchSuggestion[] | any> {
        if (Array.isArray(search)) {
            search = search[0];
        }
        return this.SearchSuggestionModel.find({$text: {$search: search}})
            // .skip(skip)
            .limit(limit)
            .exec();
    }

    async atlasFullTextSearchAutocompleSuggestions(args: string[], limit: number = 10): Promise<SearchSuggestion[] | any> {
        return this.SearchSuggestionModel.aggregate([
            {
                $search: {
                    text: {
                        query: args,
                        path: ['search'],
                    },
                    highlight: {path: 'search'},
                },

            },
            {
                $project: {
                    search: 1,
                    lastUsedAt: 1,
                    useCount: 1,
                    score: {$meta: 'searchScore'},
                    highlight: {$meta: 'searchHighlights'},
                },
            },
            {
                $limit: limit,
            },
        ]).exec();
    }
}
