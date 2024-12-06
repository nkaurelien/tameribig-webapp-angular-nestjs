import {Body, Controller, Delete, Get, Param, Post, Put, Response} from '@nestjs/common';
import {CreateTopicDto} from './dto/create-topic.dto';
import {TopicsService} from './topics.service';
import {TopicRoutesToken} from './topics.constants';
import {ResponseUtils} from '@core/utils';
import {GeneratorService} from "@core/services/generator.service";
import {UpdateTopicDto} from "./dto/update-topic.dto";

@Controller(`/${TopicRoutesToken.root}`)
export class TopicsController {
    constructor(
        private readonly topicsService: TopicsService,
        private readonly generator: GeneratorService,
    ) {
    }

    @Post()
    async create(
        @Body() body: CreateTopicDto,
        @Response() res) {
        body.uid = this.generator.uuid();
        body.createdAt = (new Date()).toLocaleString();
        const data = await this.topicsService.mongodb.create(body);
        return ResponseUtils.sendCreated(res, data);
    }

    @Get()
    async findAll(@Response() res): Promise<any> {

        const data = await this.topicsService.mongodb.findAll();
        return ResponseUtils.sendResponse(res, data);
    }

    @Get('me')
    async findAllByAuth(
        @Param() params,
        @Response() res,
    ): Promise<any> {

        const data = await this.topicsService.mongodb.findAll();
        return ResponseUtils.sendResponse(res, data);
    }

    @Get(`/${TopicRoutesToken.singleItem}`)
    async findOneById(
        @Param() params,
        @Response() res,
    ): Promise<any> {

        const data = await this.topicsService.mongodb.findById(params.id);
        if (!data) {
            return ResponseUtils.sendNotFoundError(res);
        }
        return ResponseUtils.sendResponse(res, data);
    }

    @Put(`/${TopicRoutesToken.singleItem}`)
    async updateOneById(
        @Param() params,
        @Body() body: UpdateTopicDto,
        @Response() res,
    ): Promise<any> {


        body.updatedAt = (new Date()).toLocaleString();
        const data = await this.topicsService.mongodb.updateOneById(params.id, body);

        return ResponseUtils.sendResponse(res, {
            ...data,
            ...body,
        });
    }

    @Delete(`/${TopicRoutesToken.singleItem}`)
    async deleteOneById(
        @Param() params,
        @Response() res,
    ): Promise<any> {

        const data = await this.topicsService.mongodb.remove({uid: params.id});
        return ResponseUtils.sendResponse(res, data);
    }


}
