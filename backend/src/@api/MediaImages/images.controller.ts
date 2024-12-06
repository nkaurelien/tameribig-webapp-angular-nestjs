/* tslint:disable:variable-name no-console */
import {Body, Controller, Delete, Get, Param, Post, Put, Request, Response, UseGuards} from '@nestjs/common';
import {CreateImageDto} from './dto/create-image.dto';
import {ImagesService} from './images.service';
import {ImageRoutesToken} from './images.constants';
import {ResponseUtils} from '@core/utils';
import {GeneratorService} from '@core/services/generator.service';
import {AuthUser, AuthUserPublicInfo} from '@core/decorators/auth-user.decorator';
import {UpdateImageDto} from './dto/update-image.dto';
import {AuthGuard} from '@nestjs/passport';
import {CloudinaryService} from '@core/services/cloudinary.service';
import {get as _get} from 'lodash';
import {AppLogger} from '@core/exceptions/AppLogger';
import {image_presenter} from '@api/MediaImages/interfaces/images.interface';
import {sentimentAnalyze} from '@core/classes/Sentiment/Sentiment';

@Controller(`/${ImageRoutesToken.root}`)
export class ImagesController {
    constructor(
        private readonly imagesService: ImagesService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly generator: GeneratorService,
        private readonly logger: AppLogger,
    ) {
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Post()
    async create(
        @AuthUserPublicInfo() user,
        @Body() body: CreateImageDto,
        @Response() res) {

        // console.log({user});

        body.uid = this.generator.uuid();
        body.authorId = user.uid;
        body.author = user;
        body.topics = [];
        body.createdAt = (new Date()).toISOString();
        const data = await this.imagesService.mongodb.create(body);
        return ResponseUtils.sendCreated(res, data);
    }

    @Post(`search`)
    async atlasFullTextSearch(
        @Body() body: string | string[],
        @Response() res,
    ): Promise<any> {
        let text = body;
        if (Array.isArray(body)) {
            text = body.join(' ');
        }
        const result = sentimentAnalyze(text as string);
        // const words = result.positive; // only positive word
        // const sentimentScore  = result.score;
        // const words = result.words;
        const words = result.tokens;
        const data = await this.imagesService.mongodb.atlasFullTextSearch(words || []);
        return ResponseUtils.sendResponse(res, data);
    }

    // -----------------------------------

    @Get()
    async findAll(@Response() res): Promise<any> {

        const data = await this.imagesService.mongodb.findAllWithHidden();

        return ResponseUtils.sendResponse(res, data.map(image => image_presenter(image)));
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Get('me')
    async findAllByAuth(
        @Param() params,
        @Response() res,
        @Request() req,
        @AuthUser() user,
    ): Promise<any> {

        console.log('req.user._id,', req.user, user);

        const data = await this.imagesService.mongodb.find({
            authorId: user.uid,
        });
        return ResponseUtils.sendResponse(res, data);
    }

    @Get(`/${ImageRoutesToken.singleItem}`)
    async findOneById(
        @Param() params,
        @Response() res,
    ): Promise<any> {

        const data = await this.imagesService.mongodb.findByIdWithHidden(params.id);
        if (!data) {
            return ResponseUtils.sendNotFoundError(res);
        }
        return ResponseUtils.sendResponse(res, image_presenter(data));
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Put(`/${ImageRoutesToken.singleItem}`)
    async updateOneById(
        @Param() params,
        @Body() body: UpdateImageDto,
        @Response() res,
    ): Promise<any> {

        body.updatedAt = (new Date()).toISOString();
        const data = await this.imagesService.mongodb.updateOneById(params.id, {...body});

        return ResponseUtils.sendResponse(res, {
            ...image_presenter(data),
            ...body,
        });
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Delete(`/${ImageRoutesToken.singleItem}`)
    async deleteOneById(
        @Param() params,
        @Response() res,
    ): Promise<any> {

        const data = await this.imagesService.mongodb.remove({uid: params.id});
        return ResponseUtils.sendResponse(res, data);
    }

    // =================================================================================

    @UseGuards(AuthGuard('passport-firebase'))
    @Put(`/${ImageRoutesToken.singleItemPublish}`)
    async publishOneById(
        @Param() params,
        @Response() res,
    ): Promise<any> {

        const data = await this.imagesService.mongodb.publishOneById(params.id);
        return ResponseUtils.sendResponse(res, {
            ...data,
        });
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Put(`/${ImageRoutesToken.singleItemUnpublish}`)
    async unpublishOneById(
        @Param() params,
        @Response() res,
    ): Promise<any> {

        const data = await this.imagesService.mongodb.unpublishOneById(params.id);
        return ResponseUtils.sendResponse(res, {
            ...data,
        });
    }

    // =================================================================================

    @UseGuards(AuthGuard('passport-firebase'))
    @Post(`/${ImageRoutesToken.singleItemKeywords}`)
    async addKeywords(
        @Param() params,
        @Body() body: string[],
        @Response() res,
    ): Promise<any> {

        const data = await this.imagesService.mongodb.addKeywords(params.id, (body || []));
        return ResponseUtils.sendResponse(res, null);
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Delete(`/${ImageRoutesToken.singleItemKeywords}`)
    async removeKeywords(
        @Param() params,
        @Body() body: string[],
        @Response() res,
    ): Promise<any> {

        (body || []).forEach(async keyword => {
            await this.imagesService.mongodb.removeKeyword(params.id, keyword);
        });
        return ResponseUtils.sendResponse(res, null);
    }

    // =================================================================================

    @UseGuards(AuthGuard('passport-firebase'))
    @Get(`/${ImageRoutesToken.singleItemComments}`)
    async getComments(
        @Param() params,
        @Response() res,
    ): Promise<any> {

        const data = await this.imagesService.mongodb.find({_id: params.id});
        return ResponseUtils.sendResponse(res, data.map(I => I.comments));
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Post(`/${ImageRoutesToken.singleItemComments}`)
    async createComments(
        @Param() params,
        @Body() body,
        @Response() res,
    ): Promise<any> {
        const updated = await this.imagesService.mongodb.addComment(params.id, body);
        updated.comments.push(body);
        return ResponseUtils.sendResponse(res, updated);
    }

    // =====================================================================================

    @UseGuards(AuthGuard('passport-firebase'))
    @Get(`/${ImageRoutesToken.singleItemViewsUp}`)
    async viewsUp(
        @Param() params,
        @Request() req,
        @Response() res,
    ): Promise<any> {
        const user = req.user;
        const data = await this.imagesService.mongodb.viewsUp(params.id);
        return ResponseUtils.sendResponse(res, data.views);
    }

    // =====================================================================================

    @UseGuards(AuthGuard('passport-firebase'))
    @Get(`/${ImageRoutesToken.singleItemVoteUp}`)
    async voteUp(
        @Param() params,
        @Request() req,
        @Response() res,
    ): Promise<any> {
        const user = req.user;
        const data = await this.imagesService.mongodb.voteUp(params.id);
        return ResponseUtils.sendResponse(res, data.upvotes);
    }

    @UseGuards(AuthGuard('passport-firebase'))
    @Get(`/${ImageRoutesToken.singleItemVoteUp}`)
    async voteDown(
        @Param() params,
        @Request() req,
        @Response() res,
    ): Promise<any> {
        const user = req.user;
        const data = await this.imagesService.mongodb.voteDown(params.id);
        return ResponseUtils.sendResponse(res, data.upvotes);
    }

    /**
     *
     * url de telechargement des fichiers sur le serveur
     *
     * @see http://localhost:3000/images/5e2abcb28ddd5425987c02d3/download-picture-archive
     * @param params
     * @param req
     * @param res
     */
    @Get(`/${ImageRoutesToken.singleItemDownloadImage}`)
    async downloadImage(
        @Param() params,
        @Request() req,
        @Response() res,
    ): Promise<any> {

        try {
            const image = await this.imagesService.mongodb.findByIdWithHidden(params.id);
            const public_id = _get(image, 'services.cloudinary.public_id'.split('.'));
            const format = _get(image, 'services.cloudinary.format'.split('.'), 'zip');
            const public_ids = [public_id];
            const tags = [params.id];
            // const data =  await this.cloudinaryService.private_download_url(public_id, format, {});
            const data = await this.cloudinaryService.downloadZipUrl(tags, {});
            return data;

        } catch (e) {
            console.log({error: e});
            this.logger.error(e, e);

            throw e;

        }
    }

    /**
     *
     * url de telechargement des fichiers sur le serveur
     *
     * @see http://localhost:3000/images/5e2abcb28ddd5425987c02d3/download-picture-archive
     * @param params
     * @param req
     * @param res
     */
    @Get(`/${ImageRoutesToken.singleItemDownloadImageArchive}`)
    async downloadImageArchive(
        @Param() params,
        @Request() req,
        @Response() res,
    ): Promise<any> {

        try {
            const image = await this.imagesService.mongodb.findByIdWithHidden(params.id);
            const public_id = _get(image, 'services.cloudinary.public_id');
            const public_ids = [public_id];
            const tags = [params.id];
            // return this.cloudinaryService.downloadImageZip(public_ids);
            // const data =  await this.cloudinaryService.createImageZip(public_ids);
            const data = await this.cloudinaryService.downloadZipUrl(tags, {});
            return ResponseUtils.sendResponse(res, data);

        } catch (e) {
            console.log({error: e});
            this.logger.error(e, e);

            throw e;

        }
    }
}
