import {Body, Controller, Param, Post, Response, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {FileFieldsInterceptor} from '@nestjs/platform-express';
import {UploadService} from './upload.service';
import {ImageRoutesToken} from '../images.constants';
import {CloudinaryService} from '@core/services/cloudinary.service';
import {GoogleCloudStorageService} from '@core/services/google-cloud-storage.service';
import {AppLogger} from '@core/exceptions/AppLogger';
import {ResponseUtils} from "@core/utils";

const UPLOAD_FIELDS = [
    {name: 'file', maxCount: 1},
];

@Controller('images')
export class UploadController {

    constructor(
        private readonly uploadService: UploadService,
        private readonly logger: AppLogger,
        private readonly cloudinaryService: CloudinaryService,
        private readonly googleCloudStorageService: GoogleCloudStorageService,
    ) {
    }

    @Post(`/${ImageRoutesToken.singleItemUpload}`)
    @UseInterceptors(FileFieldsInterceptor(UPLOAD_FIELDS))
    async uploadFile(
        @UploadedFiles() files: any,
        @Param() params,
        @Body() body,
    ) {

        return this.uploadService.handleUploadsWithCloudinary(files, body.id || params.id);
        // return this.uploadService.handleUploads(files, body.id || params.id);
    }

    @Post(`/${ImageRoutesToken.singleItemUploadArchivedSourceFile}`)
    @UseInterceptors(FileFieldsInterceptor(UPLOAD_FIELDS))
    async uploadArchivedSourceFile(
        @Response() res: any,
        @UploadedFiles() files: any,
        @Param() params,
        @Body() body,
    ) {

        const data = await this.uploadService.handleArchiveUploadsWithCloudinary(files, body.id || params.id);
        return ResponseUtils.sendResponse(res, data, 'Envois réussi');
        // return this.uploadService.handleArchiveUploadsToGoogleStorage(files, body.id || params.id);
        // return this.uploadService.handleArchiveUploads(files, body.id || params.id);
    }

}
