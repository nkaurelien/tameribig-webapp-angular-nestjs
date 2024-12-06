/* tslint:disable:variable-name no-console */
import {Injectable} from '@nestjs/common';
import {ConfigService} from '../config/_services/ConfigService';
import {GeneratorService} from './generator.service';
import {AssetUploadResponse} from '@core/classes/Cloudinary/AssetUploadResponse';
import {join} from 'path';
import {AppLogger} from '@core/exceptions/AppLogger';
import moment from 'moment';
import 'moment/locale/fr';

@Injectable()
export class CloudinaryService {
    private readonly _cloudinary: any;

    constructor(
        public configService: ConfigService,
        public generatorService: GeneratorService,
        public logger: AppLogger,
    ) {

        moment.locale('fr');

        this._cloudinary = bootstrapCloudinary();
    }

    get cloudinary() {
        return this._cloudinary;
    }

    async private_download_url(public_id: string, format: string, {expiration_days = 1, resource_type = 'image', attachment = true}: { expiration_days?: number, resource_type?: string, attachment?: boolean }): Promise<any> {
        const expires_at = moment().add(expiration_days, 'days').unix();
        console.log({resource_type, expiration_days, format});
        return new Promise((resolve, reject) => {
            this._cloudinary.utils.private_download_url(public_id, format, {
                resource_type,
                expires_at,
                attachment,
            }, (error, result) => {
                console.log({error, result});

                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }

    downloadZipUrl(tags: string[], {expiration_days = 1}): any {

        const expires_at = moment().add(expiration_days, 'days').unix();
        return this._cloudinary.utils.download_zip_url({
            tags,
            expires_at,
            flatten_folders: true,
            use_original_filename: false
        });
    }

    createImageZip(public_ids: string[]): Promise<any> {
        const target_public_id = public_ids[0];
        return new Promise((resolve, reject) => {
            this._cloudinary.uploader.create_zip({
                public_ids,
                resource_type: 'image',
                target_public_id,
            }, (error, result) => {
                console.log(result, error);
                if (error) {
                    reject(error);
                    this.logger.log(error);
                }
                resolve(result);
            });
        });
    }

    /**
     * @see https://cloudinary.com/documentation/image_upload_api_reference#generate_archive_method
     *
     * keep_derived Indique s'il faut conserver les actifs dérivés utilisés pour générer l'archive.
     *
     * @param public_ids
     * @param target_format
     */
    async downloadImageArchive(public_ids: string[], target_format: string = 'zip'): Promise<any> {

        //
        const keep_derived = true;

        const options = {
            // mode: 'download',
            resource_type: 'image',
            allow_missing: false,
            public_ids,
            target_format,

            keep_derived,
        };
        return this._cloudinary.utils.downloadZipUrl(options);

    }

    /**
     *
     * Overlay blending effects
     * Effects: screen, multiply, overlay, mask, anti_removal
     *
     * @param file_path
     * @param imageID
     * @param imageWidth
     * @param imageHeight
     */
    async uploadImage(file_path: string, imageID: string, {imageWidth, imageHeight}): Promise<AssetUploadResponse> {

        return new Promise((resolve, reject) => {

            // const overlay = this.makeTextNameOverlay();
            // const image_overlay_public_id = this.makeImageOverlay({imageWidth, imageHeight});
            // const image_overlay_public_id = 'logos:LOGO_TEXTE_TAMERI_BIG-01_kepe5f';
            const image_overlay_public_id = 'watermarks:LOGOz_DEF-08_dqeugs';
            const min_width = 320;

            this._cloudinary.uploader.upload(file_path,
                {
                    resource_type: 'image',
                    public_id: 'app/storage/upload/medias/images/' + imageID,
                    tags: ['image', imageID],
                    overwrite: true,
                    colors: true,
                    phash: true,
                    type: 'private',
                    responsive_breakpoints: {
                        create_derived: true,
                        bytes_step: 20000,
                        min_width,
                        max_width: 1000,
                    },
                    eager: [
                        {
                            width: min_width,
                            crop: 'fit',
                            overlay: image_overlay_public_id,
                            effect: 'screen',
                            flags: 'tiled',
                        },
                        {
                            width: min_width,
                            crop: 'fit',
                            overlay: image_overlay_public_id,
                            effect: 'screen',
                            flags: `tiled.attachment:${imageID}`,
                        },
                    ],
                    transformation: [
                        {width: imageWidth, height: imageHeight},
                        // {overlay: image_overlay_public_id, opacity: 50, width: 200, effect: "brightness:200", flags: "tiled"},
                        // {overlay: image_overlay_public_id, width: 200, effect: "screen", flags: "tiled"},
                    ],
                    html_width: imageWidth,
                    html_height: imageHeight,
                    // notification_url: "https://mysite.example.com/notify_endpoint"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });

        });
    }

    async uploadVideo(file_path: string, videoID: string): Promise<AssetUploadResponse> {

        return new Promise((resolve, reject) => {

            this._cloudinary.uploader.upload(file_path,
                {
                    resource_type: 'video',
                    chunk_size: 6000000,
                    public_id: 'medias/videos/' + videoID,
                    overwrite: true,
                    // eager: [
                    //     { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                    //     { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],
                    // eager_async: true,
                    // eager_notification_url: "https://mysite.example.com/notify_endpoint"
                },
                (error, result) => {
                    console.log(result, error);
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });

        });
    }

    async uploadRawFile(file: any, fileID: string): Promise<AssetUploadResponse> {

        const {path, originalname, size} = file;
        return new Promise((resolve, reject) => {

            this._cloudinary.uploader.upload(path,
                {
                    resource_type: 'raw',
                    chunk_size: 6000000,
                    public_id: 'app/storage/upload/medias/raw/' + fileID,
                    overwrite: true,
                    type: 'private',
                    tags: ['raw', `raw/${fileID}`],
                },
                (error, result) => {
                    // console.log(result, error);
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
        });
    }

    private makeImageOverlay({imageWidth, imageHeight}) {

        const public_id = 'tameri-watermark';
        const maskPath = join(process.cwd(), 'src', 'resources', 'images', 'mask', 'mask4.png');
        this._cloudinary.uploader.upload(maskPath, {
            public_id,
            overwrite: true,
            width: imageWidth,
            height: imageHeight,
            crop: 'fit',
            // crop: "pad",
            // overwrite: true,
            // use_filename: true,
        });

        return public_id;
    }

    private makeTextNameOverlay() {
        this._cloudinary.uploader.text('Tameri BIG', {
            public_id: 'dark_name',
            overwrite: true,
            font_family: 'Arial',
            font_size: 12,
            font_color: 'black',
            backgound: 'white',
            font_weight: 'bold',
            opacity: 90,
        });

        const text_overlay = {
            overlay: 'text:dark_name',
            gravity: 'south_east',
            x: 5, y: 5,
        };

        return text_overlay;

    }
}

function bootstrapCloudinary() {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: 'tameribig-dev',
        api_key: '558746438725712',
        api_secret: 'oo1nS-FYRW8dEG7w-pjw-IvCZVI',
    });

    return cloudinary;
}
