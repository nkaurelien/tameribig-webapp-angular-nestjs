import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {Topics} from './interfaces/topics.interface';
import {TOPICS_COLLECTION_INDEX,} from './topics.constants';
import {InjectModel} from '@nestjs/mongoose';
import {CreateTopicDto} from './dto/create-topic.dto';
import {UpdateTopicDto} from "@api/Topics/dto/update-topic.dto";

@Injectable()
export class TopicsMongodbService {

    constructor(
        @InjectModel(TOPICS_COLLECTION_INDEX)
        private readonly topicsModel: Model<Topics>,
    ) {
    }

    async create(data: CreateTopicDto): Promise<Topics | any> {
        // Mongo DB
        const item = new this.topicsModel(data);
        return await item.save();
    }

    async findAll(): Promise<Topics[] | any> {
        return await this.topicsModel.find().lean().exec();
    }

    async remove(criterias: { uid: string }): Promise<any> {
        return await this.topicsModel.remove(criterias).lean().exec();
    }

    find(criterias: Partial<Topics>): Promise<Topics[] | any> {

        const query = this.topicsModel.find();
        query.where(criterias);
        query.limit(1000);
        return query.lean().exec();

    }

    public findById(ID: string): Promise<Topics | any> {
        let query = this.topicsModel.findById(ID);
        return query.lean().exec();
    }

    async updateOneById(
        ID: string,
        datas: UpdateTopicDto,
    ): Promise<Topics | any> {
        return await this.topicsModel.findByIdAndUpdate(ID, datas).lean().exec();
    }

    async update(
        criterias: Partial<Topics>,
        datas: Partial<Topics>,
    ): Promise<Topics | any> {
        const query: any = {...criterias};
        return await this.topicsModel.update(query, datas, {
            multi: true,
        }).exec();
    }

    public addComment(ID: string, comment: string): Promise<Topics | any> {
        return this.topicsModel.findByIdAndUpdate(ID, {$push: {comments: comment}}).lean().exec();
    }

    public removeComment(ID: string, comment): Promise<Topics | any> {
        const update = {$pull: {comments: comment}};
        return this.topicsModel.findByIdAndUpdate(ID, update).lean().exec();
    }

    public clearComments(ID: string): Promise<Topics | any> {
        const update = {$set: {comments: []}};
        return this.topicsModel.findByIdAndUpdate(ID, update).lean().exec();
    }
}
