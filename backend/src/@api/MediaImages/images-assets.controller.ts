import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Next,
    Param,
    Post,
    Request,
    Response,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {Author} from './interfaces/images.interface';
import {CreateImageDto} from './dto/create-image.dto';
import {ImagesService} from './images.service';
import {GoogleCloudStorage} from '@core/classes/GoogleCloudStorage';
import {FileInterceptor} from '@nestjs/platform-express';
import {ImageRoutesToken} from "@api/MediaImages/images.constants";

// import * as uuidv4 from 'uuid/v4';
@Controller(`/${ImageRoutesToken.root}`)
export class ImagesAssetsController {
    constructor(private readonly imagesService: ImagesService) {
    }

    @Post('uploadHandler')
    @UseInterceptors(FileInterceptor('file'))
    async uploadHandler(
        @UploadedFile() file,
        /*@Body() createImageDto: CreateImageDto,*/ @Request() req,
        @Response() res,
        @Next() next,
    ) {
        if (!file) {
            // res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send('Uploader au moins une image');
            return res;
        }

        const uuidv4 = require('uuid/v4');

        const gcs = new GoogleCloudStorage();
        const result = await gcs.UploadStream(file, req, res, next);

        const originalPrivate = result[0];
        const maskedMiniaturePublic = result[1];

        // console.log({file, result});
        // return;

        let data = req.body;

        // console.log(req.file, publicUrl);

        if (originalPrivate && maskedMiniaturePublic) {
            data.imageUrl = maskedMiniaturePublic.cloudStorageUrl;
            data.miniature = maskedMiniaturePublic.cloudStorageUrl;
            data.imageName = maskedMiniaturePublic.cloudStorageFileName;

            const user = JSON.parse(data.user || '{}');

            const author: Author = {
                fullname: user.displayName,
                displayName: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                uid: user.uid,
            };

            const img = new CreateImageDto({
                author,
                uid: uuidv4(),
                title: file.originalname,
                description: data.description || '',
                userId: author.uid,
                content: data.content || '',
                picture: data.imageUrl,
                fileName: data.imageName,
                miniature: data.miniature,
                price: data.prix || data.price || 500,
                createdAt: '' + new Date().getTime(),
            });

            data = {
                ...img,
            };

            this.imagesService.firebase.create(data);

            data.imageUrl = 'Masked';
            data.picture = 'Masked';
            res.status(200).json(data);
        }
    }

    /**
     * @see http://localhost:3000/images/downloadHandler?srcFilename=1562513546937971310_474010869360452_2116491347_n.jpg
     * @see http://localhost:3000/images/downloadHandler?srcFilename=delivery-man (1).svg
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    @Get('downloadHandler')
    async downloadHandler(@Request() req, @Response() res, @Next() next) {
        const gcs = new GoogleCloudStorage();
        return await gcs.DownloadStream(req, res, next);
    }

    /**
     * @see http://localhost:3000/images/open/133f95eb-dad1-4bac-aaab-c5bb309f2c09
     * @param params
     * @param req
     * @param res
     * @param next
     */
    @Get('open/:id')
    async open(@Param() params, @Request() req, @Response() res, @Next() next) {
        const img = await this.imagesService.firebase.find(params.id);
        if (!img.data) {
            throw new HttpException('image not found', HttpStatus.NOT_FOUND);
        }

        const srcFilename = img.data.fileName;
        if (srcFilename === undefined) {
            throw new HttpException(
                'image srcFilename attribute are undefined',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        req.query = {
            ...req.query,
            srcFilename,
        };

        const gcs = new GoogleCloudStorage();
        // console.log(req);

        return await gcs.Download(req, res, next);
    }

    /**
     * telecharge le fichier sur le serveur
     *
     * @see http://localhost:3000/images/download?srcFilename=1562513546937971310_474010869360452_2116491347_n.jpg
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    @Get('download')
    async downloadImage(@Request() req, @Response() res, @Next() next) {
        const gcs = new GoogleCloudStorage();
        console.log(req);

        return await gcs.Download(req, res, next);
    }


}
