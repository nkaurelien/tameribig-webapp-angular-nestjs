import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {Image} from './interfaces/images.interface';
import {IMAGE_COLLECTION_INDEX} from './images.constants';
import {InjectModel} from '@nestjs/mongoose';
import {CreateImageDto} from './dto/create-image.dto';

@Injectable()
export class ImagesMongodbService {
    private includesAttributes = '+services +srcFile';

    constructor(
        @InjectModel(IMAGE_COLLECTION_INDEX)
        private readonly imageModel: Model<Image>,
    ) {
    }

    async create(data: CreateImageDto): Promise<Image | any> {
        // Mongo DB
        const item = new this.imageModel(data);
        return await item.save();
    }

    async findAll(): Promise<Image[] | any> {
        return await this.imageModel.find().lean().exec();
    }

    async findAllWithHidden(): Promise<Image[] | any> {
        return await this.imageModel.find().select(this.includesAttributes).lean().exec();
    }

    async remove(criterias: { uid: string }): Promise<any> {
        return await this.imageModel.remove(criterias).lean().exec();
    }

    async find(criterias: Partial<Image>): Promise<Image[] | any> {

        const query = this.imageModel.find();
        query.where(criterias);
        query.limit(1000);
        return query.lean().exec();

    }

    async atlasFullTextSearch(args: string[], limit: number = 10): Promise<Image[] | any> {
        return this.imageModel.aggregate([
            {
                $search: {
                    text: {
                        query: args,
                        path: ['title'],
                    },
                    highlight: {path: 'title'},
                },
                //     $search: {
                //         "autocomplete": {
                //             "query": "<search-string>",
                //             "path": "<field-to-search>",
                //             "tokenOrder": "any|sequential",
                //             "fuzzy": <options>,
                //             "score": <options>
                //         }

            },
            {
                $project: {
                    // _id: 0,
                    // services: 0,
                    // srcFile: 0,
                    title: 1,
                    // authorId: 1,
                    // uid: 1,
                    picture: 1,
                    download: 1,
                    miniature: 1,
                    description: 1,
                    // author: 1,
                    score: {$meta: 'searchScore'},
                    highlight: {$meta: 'searchHighlights'},
                },
            },
            {
                $limit: limit,
            },
        ]).exec();
    }

    public findById(ID: string, projection?: string): Promise<Image | any> {
        const query = this.imageModel.findById(ID, projection);
        return query.lean().exec();
    }

    public findByIdWithHidden(ID: string): Promise<Image | any> {
        const query = this.imageModel.findById(ID, this.includesAttributes);
        return query.lean().exec();
    }

    async updateOneById(
        ID: string,
        datas: Partial<Image>,
    ): Promise<Image | any> {
        return await this.imageModel.findByIdAndUpdate(ID, datas).lean().exec();
    }

    async unpublishOneById(
        ID: string,
    ): Promise<Image | any> {
        const body: any = {};
        body.updatedAt = (new Date()).toISOString();
        body.publishedAt = null;
        return await this.imageModel.findByIdAndUpdate(ID, body).lean().exec();
    }

    async publishOneById(
        ID: string,
    ): Promise<Image | any> {
        const body: any = {};
        body.updatedAt = (new Date()).toISOString();
        body.publishedAt = (new Date()).toISOString();
        return await this.imageModel.findByIdAndUpdate(ID, body).lean().exec();
    }

    async update(
        criterias: Partial<Image>,
        datas: Partial<Image>,
    ): Promise<Image | any> {
        const query: any = {...criterias};
        return await this.imageModel.update(query, datas, {
            multi: true,
        }).exec();
    }

    public viewsUp(ID: string): Promise<Image | any> {
        return this.imageModel.findByIdAndUpdate(ID, {$inc: {'views.total': 1}}).lean().exec();
    }

    public voteUp(ID: string): Promise<Image | any> {
        return this.imageModel.findByIdAndUpdate(ID, {$inc: {'upvotes.total': 1}}).lean().exec();
    }

    public voteDown(ID: string): Promise<Image | any> {
        return this.imageModel.findByIdAndUpdate(ID, {$inc: {'upvotes.total': -1}}).lean().exec();
    }

    public addKeywords(ID: string, keywords: string[]): Promise<Image | any> {
        return this.imageModel.findByIdAndUpdate(ID, {$addToSet: {$each: {keywords}}}).lean().exec();
    }

    public removeKeyword(ID: string, keyword: string): Promise<Image | any> {
        return this.imageModel.findByIdAndUpdate(ID, {$pull: {keywords: keyword}}).lean().exec();
    }

    public addComment(ID: string, comment: string): Promise<Image | any> {
        return this.imageModel.findByIdAndUpdate(ID, {
            $push: {
                comments: {
                    content: comment,
                    author: '',
                    createdAt: new Date().toISOString(),
                },
            },
        }).lean().exec();
    }

    public removeComment(ID: string, comment): Promise<Image | any> {
        const update = {$pull: {comments: comment}};
        return this.imageModel.findByIdAndUpdate(ID, update).lean().exec();
    }

    public clearComments(ID: string): Promise<Image | any> {
        const update = {$set: {comments: []}};
        return this.imageModel.findByIdAndUpdate(ID, update).lean().exec();
    }
}
