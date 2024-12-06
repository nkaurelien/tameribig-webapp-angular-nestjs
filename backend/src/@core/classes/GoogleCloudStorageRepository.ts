/* tslint:disable:no-console */
import * as stream from 'stream';

import {Response} from 'express';
import {environment} from '@environments/environment';
import * as admin from 'firebase-admin';
import {File as StorageFile} from 'firebase-admin/node_modules/@google-cloud/storage/build/src/file';
import {dirname, join} from 'path';
import {existsSync, mkdirSync} from 'fs';
import {Injectable} from '@nestjs/common';
import {DownloadResponse} from '@google-cloud/storage';

@Injectable()
export class GoogleCloudStorageRepository {
    private storage: admin.storage.Storage;

    /**
     * @param {string} bucketName 'Name of a bucket, e.g. my-bucket';
     */
    constructor(private bucketName = environment.firebaseConfig.storageBucket) {
        // const serviceAccountFile = join(process.cwd(), 'tameri-big-02050d7b516f.json');

        this.storage = admin.storage();
    }

    public async uploadStreamPromise(
        buffer: Buffer,
        blob: StorageFile,
        mimetype: string,
        makePublic: boolean,
        /* next: NextFunction,*/
    ): Promise<any> {
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: mimetype,
            },
            resumable: false,
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', reject);

            blobStream.on('finish', async () => {
                // The public URL can be used to directly access the file via HTTP.
                const getUrl = filename => {
                    return `https://storage.googleapis.com/${this.bucketName}/${filename}`;
                };
                const cloudStorageFileName = blob.name;
                const cloudStorageUrl = getUrl(blob.name);
                // if (makePublic) {
                //     await blob.makePublic();
                // } else {
                //     await blob.makePrivate();
                // }

                resolve({
                    makePublic,
                    cloudStorageUrl,
                    cloudStorageFileName,
                });
            });

            blobStream.end(buffer);
        });
    }

    /**
     *
     * @returns {Promise<StorageFile[]>}
     * @constructor
     */
    async getFiles(): Promise<StorageFile[]> {
        // // Lists files in the bucket
        const [files] = await this.storage.bucket(this.bucketName).getFiles();

        files.forEach(file => {
            console.log(file.name);
        });

        return files;
    }

    /**
     *
     * @param filename 'File to access, e.g. file.txt'
     * @returns {Promise<void>}
     * @constructor
     */
    async getFileInfos(filename: string): Promise<any> {
        // Gets the metadata for the file
        const [metadata] = await this.storage
            .bucket(this.bucketName)
            .file(filename)
            .getMetadata();

        // console.log(`File: ${metadata.name}`);
        // console.log(`Bucket: ${metadata.bucket}`);
        // console.log(`Storage class: ${metadata.storageClass}`);
        // console.log(`Self link: ${metadata.selfLink}`);
        // console.log(`ID: ${metadata.id}`);
        // console.log(`Size: ${metadata.size}`);
        // console.log(`Updated: ${metadata.updated}`);
        // console.log(`Generation: ${metadata.generation}`);
        // console.log(`Metageneration: ${metadata.metageneration}`);
        // console.log(`Etag: ${metadata.etag}`);
        // console.log(`Owner: ${metadata.owner}`);
        // console.log(`Component count: ${metadata.component_count}`);
        // console.log(`Crc32c: ${metadata.crc32c}`);
        // console.log(`md5Hash: ${metadata.md5Hash}`);
        // console.log(`Cache-control: ${metadata.cacheControl}`);
        // console.log(`Content-type: ${metadata.contentType}`);
        // console.log(`Content-disposition: ${metadata.contentDisposition}`);
        // console.log(`Content-encoding: ${metadata.contentEncoding}`);
        // console.log(`Content-language: ${metadata.contentLanguage}`);
        // console.log(`Media link: ${metadata.mediaLink}`);
        // console.log(`KMS Key Name: ${metadata.kmsKeyName}`);
        // console.log(`Temporary Hold: ${metadata.temporaryHold}`);
        // console.log(`Event-based hold: ${metadata.eventBasedHold}`);
        // console.log(`Effective Expiration Time: ${metadata.effectiveExpirationTime}`);
        // console.log(`Metadata: ${metadata.metadata}`);

        return metadata;
    }

    /**
     * This can be used to list all blobs in a "folder", e.g. "public/".
     *
     * The delimiter argument can be used to restrict the results to only the
     * "files" in the given "folder". Without the delimiter, the entire tree under
     * the prefix is returned. For example, given these blobs:
     *
     *   /a/1.txt
     *   /a/b/2.txt
     *
     * If you just specify prefix = '/a', you'll get back:
     *
     *   /a/1.txt
     *   /a/b/2.txt
     *
     * However, if you specify prefix='/a' and delimiter='/', you'll get back:
     *
     *   /a/1.txt
     *
     * @param prefix 'Prefix by which to filter, e.g. public/';
     * @param {any} delimiter 'Delimiter to use, e.g. /';
     * @returns {Promise<StorageFile[]>}
     * @constructor
     */
    async getFilesWhereIn(
        prefix: string,
        delimiter: string = '',
    ): Promise<StorageFile[]> {
        const options = {
            prefix,
            delimiter,
        };

        // Lists files in the bucket, filtered by a prefix
        const [files] = await this.storage
            .bucket(this.bucketName)
            .getFiles(options);

        console.log('Files:');
        files.forEach(file => {
            console.log(file.name);
        });
        return files;
    }

    /**
     *
     * @param filename 'File to upload, e.g. file.txt'
     * @returns {Promise<void>}
     * @constructor
     */
    async upload(file): Promise<any> {
        const makePublic = false;
        // Uploads a local file to the bucket
        const uploadResponse = await this.storage.bucket(this.bucketName).upload(file.originalname, {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,

            public: makePublic,
            metadata: {
                // Enable long-lived HTTP caching headers
                // Use only if the contents of the file will never change
                // (If the contents will change, use cacheControl: 'no-cache')
                cacheControl: 'public, max-age=31536000',
            },
        });

        console.log(`${file.originalname} uploaded to ${this.bucketName}.`);

        return uploadResponse;
    }

    /**
     *
     * @param filename
     * @param localFilename
     * @constructor
     */
    async download(filename: string, localFilename: string): Promise<DownloadResponse> {

        if (!filename) {
            return;
        }
        console.log(`srcFilename: ${filename}`);

        const downloadPath = join(
            process.cwd(),
            'storages',
            'download',
            localFilename,
        );
        const resizePath = join(
            process.cwd(),
            'storages',
            'download',
            'resize',
            localFilename,
        );

        // Test if the directory exist, if not create the directory
        const dir = dirname(resizePath);
        if (!existsSync(dir)) {
            mkdirSync(dir, {recursive: true, mode: 755});
        }

        const options = {
            // The path to which the file should be downloaded, e.g. "./file.txt"
            destination: downloadPath,
        };
        console.log(
            `gs://${this.bucketName}/${filename} downloaded to ${downloadPath}.`,
        );

        // Downloads the file
        return await this.storage
            .bucket(this.bucketName)
            .file(filename)
            .download(options);

    }

    /**
     *
     * @param filename 'File to delete, e.g. file.txt'
     * @returns {Promise<void>}
     * @constructor
     */
    async delete(filename: string) {
        // Deletes the file from the bucket
        await this.storage
            .bucket(this.bucketName)
            .file(filename)
            .delete();

        console.log(`gs://${this.bucketName}/${filename} deleted.`);
    }

    /**
     *
     * @param srcFilename
     * @param {e.Response} streamPipelineOutput
     * @param onErrorCallback
     * @param onFinishCallback
     * @returns {Promise<void>}
     * @constructor
     */
    async downloadStream(srcFilename: string, streamPipelineOutput ?: any, onErrorCallback?: (err: Error) => void, onFinishCallback?: () => void): Promise<stream.Readable> {

        // Create a new blob in the bucket and upload the file data.
        const blob = await this.storage.bucket(this.bucketName).file(srcFilename);

        const [metadata] = await blob.getMetadata();

        const blobStream = blob.createReadStream();

        blobStream.on('error', onErrorCallback);
        blobStream.on('finish', onFinishCallback);

        // blobStream.on('error', (err) => {
        //     next(err);
        // });
        //
        // blobStream.on('finish', () => {
        //     // The public URL can be used to directly access the file via HTTP.
        //     const publicUrl = format(`https://storage.googleapis.com/${this.bucketName}/${blob.name}`);
        //     res.status(200).send(publicUrl);
        // });
        //
        // blobStream.read();

        // console.log(`Cache-control: ${metadata.cacheControl}`);
        // console.log(`Content-type: ${metadata.contentType}`);
        // console.log(`Content-disposition: ${metadata.contentDisposition}`);
        // console.log(`Content-encoding: ${metadata.contentEncoding}`);
        if (!!streamPipelineOutput) {
            streamPipelineOutput.setHeader('content-type', metadata.contentType);
            blobStream.pipe(streamPipelineOutput);
        }
        return blobStream;
    }

    /**
     *
     * @param file
     * @param makePublic
     * @param onErrorCallback
     * @param onFinishCallback
     * @returns {Promise<void>}
     * @constructor
     */
    async uploadStream(file, {makePublic = false}, onErrorCallback?: (err: Error) => void, onFinishCallback?: (data) => void): Promise<stream.Writable> {

        const blob = await this.storage.bucket(this.bucketName).file(file.originalname);
        const mimetype = file.mimetype;
        const buffer = file.buffer;

        console.log(file);

        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: mimetype,
            },
            public: makePublic,
            resumable: false,
        });
        blobStream.on('error', onErrorCallback);

        blobStream.on('finish', async () => {
            // The public URL can be used to directly access the file via HTTP.

            const cloudStorageFileName = blob.name;
            const cloudStorageUrl = this.getUrl(blob.name);
            // if (makePublic) {
            //     await blob.makePublic();
            // } else {
            //     await blob.makePrivate();
            // }

            onFinishCallback({
                cloudStorageUrl,
                cloudStorageFileName,
            });
        });

        blobStream.end(buffer);

        return blobStream;
    }

    getUrl(filename) {
        return `https://storage.googleapis.com/${this.bucketName}/${filename}`;
    }

}
