import {Module} from '@nestjs/common';
import {DatabaseModule} from '@databases/database.module';
import {ImagesController} from './images.controller';
import {ImagesAssetsController} from './images-assets.controller';
import {ImagesService} from './images.service';
import {imagesProviders} from './images.providers';
import {ImagesFirebaseService} from './images-firebase.service';
import {ImagesMongodbService} from './images-mongodb.service';
import {GeneratorService} from '@core/services/generator.service';
import {CloudinaryService} from '@core/services/cloudinary.service';
import {ImageModel} from './images.model';
import {UploadController} from './upload/upload.controller';
import {UploadService} from './upload/upload.service';
import {MulterModule} from '@nestjs/platform-express';
import * as multer from 'multer';
import {MULTER_CONFIG} from './upload/multer.config';
import {ConfigModule} from '@core/config/ConfigModule';
import {ConfigService} from '@core/config/_services/ConfigService';
import {GoogleCloudStorageService} from '@core/services/google-cloud-storage.service';
import {AppLogger} from '@core/exceptions/AppLogger';

const storage = multer.diskStorage(MULTER_CONFIG);

@Module({
    imports: [
        MulterModule.register({storage}),
        ImageModel,
        DatabaseModule,
        ConfigModule.register(),
    ],
    controllers: [ImagesController, ImagesAssetsController, UploadController],
    providers: [AppLogger, ConfigService, ImagesMongodbService, ImagesFirebaseService, ImagesService, GeneratorService, GoogleCloudStorageService, CloudinaryService, UploadService, ...imagesProviders],
    exports: [ImagesMongodbService, ImagesFirebaseService, ImagesService, ...imagesProviders],
})
export class MediaImagesModule {
}
