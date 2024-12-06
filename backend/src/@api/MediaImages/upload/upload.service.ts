/* tslint:disable:variable-name no-console */
import {Injectable, UploadedFiles} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {IMAGE_COLLECTION_INDEX} from '../images.constants';
import {Image} from '../interfaces/images.interface';
import {join} from 'path';
import Jimp from 'jimp';
import {CloudinaryService} from '@core/services/cloudinary.service';
import {GoogleCloudStorageService} from '@core/services/google-cloud-storage.service';
import * as _ from 'lodash';
import {get as _get, sortBy as _sortBy} from 'lodash';
import fs = require('fs');
import sharp = require('sharp');

@Injectable()
export class UploadService {

    constructor(
        @InjectModel(IMAGE_COLLECTION_INDEX)
        private readonly imageModel: Model<Image>,
        private readonly cloudinaryService: CloudinaryService,
        private readonly googleCloudStorageService: GoogleCloudStorageService,
    ) {

    }

    public static extractExtension(originalname: string) {
        let ext = '';
        const chunk = originalname.split('.');
        if (chunk.length) {
            ext = chunk[chunk.length - 1] || '';
        }
        return ext;
    }

    public async handleUploadsWithCloudinary(@UploadedFiles() files: any[], imageID: string) {
        const file = await (files as any).file[0];
        const {path, originalname, size} = file;
        const downloadPath = file.path || (join(process.cwd(), 'storages', 'upload', 'images', file.filename));
        const image = await Jimp.read(downloadPath);
        const imageHeight = image.getHeight()/* > 500 ? 500 : image.getHeight()*/;
        const imageWidth = image.getWidth() /*> 500 ? 500 : image.getWidth()*/;

        const uploadResponse = await this.cloudinaryService.uploadImage(downloadPath, imageID, {
            imageWidth,
            imageHeight,
        });

        let breakpoints = (_get(uploadResponse, 'responsive_breakpoints.0.breakpoints'.split('.')) || []);
        breakpoints = _sortBy(breakpoints, 'width');
        const miniature_secure_url = _.get(breakpoints, ['0', 'secure_url']);
        const picture_secure_url = _.get(uploadResponse, ['eager', '0', 'secure_url']);
        const download_secure_url = _.get(uploadResponse, ['eager', '1', 'secure_url']);

        // return {miniature_secure_url, download_secure_url, uploadResponse};

        const update: Partial<Image> = {
            // fileName: file.filename,
            originalname,
            picture: picture_secure_url,
            download: download_secure_url,
            miniature: miniature_secure_url,
            // encoding: file.encoding,
            // mimetype: file.mimetype,
            services: {cloudinary: uploadResponse},
            updatedAt: (new Date()).toISOString(),
        };


        // Suppression du fichier sur le disque local
        fs.unlinkSync(path);

        return await this.imageModel.findByIdAndUpdate(imageID, update, {new: true}).lean().exec();

    }

    public async handleArchiveUploadsWithCloudinary(@UploadedFiles() files: any[], fileID: string) {

        const file = await (files as any).file[0];
        const {path, originalname, size} = file;
        // const storageRelativePath = (path as string).substr(process.cwd().length);
        const uploadResponse = await this.cloudinaryService.uploadRawFile(file, fileID);
        const update: Partial<Image> = {
            updatedAt: (new Date()).toISOString(),
            srcFile: {
                bytes: size,
                originalname,
                downloadUrl: uploadResponse.url,
                downloadSecureUrl: uploadResponse.secure_url,
                services: {cloudinary: uploadResponse},
            },
        };

        // Suppression du fichier sur le disque local
        fs.unlinkSync(path);

        return await this.imageModel.findByIdAndUpdate(fileID, update, {new: true}).lean().exec();

    }

    public async handleUploads(@UploadedFiles() files: any[], imageID: string) {

        const file = await (files as any).file[0];
        const ext = UploadService.extractExtension(file.originalname);

        const name = [file.filename, ext].join('.').toLowerCase();
        const nameMin = [file.filename, 'min', ext].join('.').toLowerCase();

        // redimensionnement

        const downloadPath = file.path || (join(process.cwd(), 'storages', 'upload', 'images', file.filename));
        const outputPath = join(process.cwd(), 'storages', 'public', 'images', name);
        const outputResizedPath = join(process.cwd(), 'storages', 'public', 'images', nameMin);
        const maskPath = join(process.cwd(), 'src', 'resources', 'images', 'mask', 'mask4.png');
        const maskOutputPath = join(process.cwd(), 'storages', 'upload', 'images', 'mask4.temp.png');
        const maskOutputResizedPath = join(process.cwd(), 'storages', 'upload', 'images', 'mask4.min.temp.png');

        const image = await Jimp.read(downloadPath);
        // image.quality(75).resize(250, Jimp.AUTO).writeAsync(resizePath);
        // image.quality(75).writeAsync(resizePath);

        // const mime = image.getMIME();
        // const buffer = await image.quality(70).getBufferAsync(mime);

        sharp.cache(false);
        await sharp(maskPath)
            .resize(image.getWidth() - 50, image.getHeight() - 50)
            .toFile(maskOutputPath)
            .then((/*outputFile*/) => {
                return sharp(downloadPath)
                    .composite([{input: maskOutputPath}])
                    // .jpeg( { quality: 90 } )
                    .toFile(outputPath);
            }).then(() => {
                fs.unlinkSync(maskOutputPath);
            });

        await sharp(maskPath)
            .resize(620 - 50)
            .toFile(maskOutputResizedPath)
            .then(() => {
                return sharp(downloadPath)
                    .composite([{input: maskOutputResizedPath}])
                    .resize(620)
                    // .jpeg( { quality: 90 } )
                    .toFile(outputResizedPath);
            }).then(() => {
                fs.unlinkSync(maskOutputResizedPath);
            });

        // .toBuffer()
        // .then(function(outputBuffer) {
        //     // outputBuffer contains upside down, 300px wide, alpha channel flattened
        //     // onto orange background, composited with overlay.png with SE gravity,
        //     // sharpened, with metadata, 90% quality WebP image data. Phew!
        // })

        // fs.unlinkSync(downloadPath);

        // sauvegarde

        const update: Partial<Image> = {
            fileName: file.filename,
            picture: name,
            miniature: nameMin,
            encoding: file.encoding,
            mimetype: file.mimetype,
            updatedAt: (new Date()).toISOString(),
        };

        return await this.imageModel.findByIdAndUpdate(imageID, update).lean().exec();
    }

    async handleArchiveUploads(@UploadedFiles() files: any, imageID: any) {

        // TODO Validate archive content, check images inside

        const file = await (files as any).file[0];
        const storageRelativePath = (file.path as string).substr(process.cwd().length);
        const update: Partial<Image> = {
            updatedAt: (new Date()).toISOString(),
            srcFile: {
                bytes: file.size,
                downloadUrl: storageRelativePath,
            },
        };
        return await this.imageModel.findByIdAndUpdate(imageID, update).lean().exec();

    }

    async handleArchiveUploadsToGoogleStorage(@UploadedFiles() files: any, fileID: any) {

        // TODO Validate archive content, check images inside

        const file = await (files as any).file[0];
        const downloadPath = file.path || (join(process.cwd(), 'storages', 'upload', 'images', file.filename));

        const uploadResponse = await this.googleCloudStorageService.uploadRawFile(downloadPath, fileID);
        // const originalPrivate = uploadResponse[0];
        // const maskedMiniaturePublic = uploadResponse[1];

        const storageRelativePath = (file.path as string).substr(process.cwd().length);
        const update: Partial<Image> = {
            updatedAt: (new Date()).toISOString(),
            srcFile: {
                bytes: file.size,
                downloadUrl: storageRelativePath,
            },
        };
        return await this.imageModel.findByIdAndUpdate(fileID, update).lean().exec();

    }
}
