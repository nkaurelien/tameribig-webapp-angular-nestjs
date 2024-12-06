import {NextFunction, Response} from 'express';
import {environment} from '@environments/environment';
import * as admin from 'firebase-admin';
import {JimpImageHelper} from './JimpImageHelper';
import {GoogleCloudStorageRepository} from "@core/classes/GoogleCloudStorageRepository";

export class GoogleCloudStorageV2 {
    private storage: admin.storage.Storage;
    private repo: GoogleCloudStorageRepository;

    /**
     *
     * @param {string} bucketName 'Name of a bucket, e.g. my-bucket';
     */
    constructor(private bucketName = environment.firebaseConfig.storageBucket) {
        // const serviceAccountFile = join(process.cwd(), 'tameri-big-02050d7b516f.json');

        this.storage = admin.storage();
        this.repo = new GoogleCloudStorageRepository()

    }

    /**
     *
     * @param file
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     * @returns {Promise<void>}
     * @constructor
     */
    async UploadStream(
        file,
        req,
        res: Response,
        next: NextFunction,
    ): Promise<any> {
        if (!file) {
            return next();
        }

        const chunk = file.originalname.split('.');
        const ext = chunk[chunk.length - 1] || '';
        let gcsnameMin = [file.originalname, 'min', ext].join('.');

        // Create a new blob in the bucket and upload the file data.
        const gcsname = Date.now() + file.originalname;
        gcsnameMin = Date.now() + gcsnameMin;
        const blob = await this.storage.bucket(this.bucketName).file(gcsname);
        const blobMin = await this.storage.bucket(this.bucketName).file(gcsnameMin);

        // Build Miniature
        const imageHelper = new JimpImageHelper(file.buffer);
        const image = await imageHelper.applyMask4();
        const mime = image.getMIME();
        const maskedMiniatureBuffer = await image.quality(70).getBufferAsync(mime);

        let promises = [];

        promises[0] = this.repo.uploadStreamPromise(
            file.buffer,
            blob,
            file.mimetype,
            false,
        );
        promises[1] = this.repo.uploadStreamPromise(
            maskedMiniatureBuffer,
            blobMin,
            mime,
            true,
        );

        return Promise.all(promises);
    }
}
