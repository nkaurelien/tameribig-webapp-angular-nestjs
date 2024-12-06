import {NextFunction, Response} from 'express';
import {environment} from '@environments/environment';
import * as admin from 'firebase-admin';
import {File as StorageFile} from 'firebase-admin/node_modules/@google-cloud/storage/build/src/file';
import archiver from 'archiver';
import {dirname, join} from 'path';
import {existsSync, mkdirSync} from 'fs';
import {JimpImageHelper} from './JimpImageHelper';
import {GoogleCloudStorageV2} from '@core/classes/GoogleCloudStorageV2';
import {GoogleCloudStorageRepository} from '@core/classes/GoogleCloudStorageRepository';

export class GoogleCloudStorage {
    public static readonly v2 = GoogleCloudStorageV2;
    private storage: admin.storage.Storage;
    private repo: GoogleCloudStorageRepository;

    /**
     *
     * @param {string} bucketName 'Name of a bucket, e.g. my-bucket';
     */
    constructor(private bucketName = environment.firebaseConfig.storageBucket) {
        // const serviceAccountFile = join(process.cwd(), 'tameri-big-02050d7b516f.json');

        this.storage = admin.storage();
        // var bucket = admin.storage().bucket();
        this.repo = new GoogleCloudStorageRepository();
    }

    /**
     *
     * @returns {Promise<StorageFile[]>}
     * @constructor
     */
    async GetFiles(): Promise<StorageFile[]> {
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
    async GetFileInfos(filename: string): Promise<any> {
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
    async GetFilesWhereIn(
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

        const promises = [];

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

    /**
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     * @returns {Promise<void>}
     * @constructor
     */
    async DownloadStream(req, res, next): Promise<void> {
        const srcFilename = req.query.srcFilename;
        console.log(`srcFilename: ${srcFilename}`);

        // Create a new blob in the bucket and upload the file data.
        const blob = await this.storage.bucket(this.bucketName).file(srcFilename);

        const [metadata] = await blob.getMetadata();

        const blobStream = blob.createReadStream();

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
        res.setHeader('content-type', metadata.contentType);
        blobStream.pipe(res);
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<any>}
     * @constructor
     */
    async DownloadZipped(req, res, next): Promise<any> {
        const srcFilename = req.query.srcFilename;
        const destFilename = req.query.srcFilename || 'download';
        console.log(`srcFilename: ${srcFilename}`);

        const downloadPath = join(
            process.cwd(),
            'storages',
            'download',
            destFilename,
        );
        const resizePath = join(
            process.cwd(),
            'storages',
            'download',
            'resize',
            destFilename,
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
        // Downloads the file
        await this.storage
            .bucket(this.bucketName)
            .file(srcFilename)
            .download(options);

        const imageHelper = new JimpImageHelper(downloadPath);

        const image = await imageHelper.applyMask4();

        // export image

        // const resizedImage = await image.quality(100).writeAsync(resizePath);
        const mime = image.getMIME();
        const buffer = await image.quality(100).getBufferAsync(mime);

        // Zippage
        const archive = archiver(
            'zip' /*, {
            zlib: { level: 9 }, // Sets the compression level.
        }*/,
        );

        archive.on('error', err => {
            res.status(500).send({error: err.message});
        });

        archive.on('close', () => {
            // res.contentType('zip');
            // res.attachment(destFilename + '.zip');
            // console.log('Archive wrote %d bytes', archive.pointer());
            // return res.status(200).send('OK').end();
        });

        res.on('close', () => {
            console.log('Archive wrote %d bytes', archive.pointer());
            return res.status(200).end();
        });

        // create a file to stream archive data to.
        // const output = createWriteStream(`${resizePath}.zip`);

        res.contentType('zip');
        res.attachment(destFilename + '.zip');

        archive.pipe(res);
        // archive.pipe(output);

        archive.append(
            [
                'Author',
                '======',
                'Name       Nkaurelien',
                'Email      Nkaurelien@gmail.com',
                'Twitter    @nkaurelien',
                'Likes      0',
                'Dislikes   0',
                '',
                'Image',
                '======',
                `Type       ${mime}`,
                `Categorie  Africa`,
                `Download   1`,
                '',
                '----------------------------------',
                '',
                'Visit:',
                'Tameribig.com',
            ].join('\r\n'),
            {name: 'Readme.txt'},
        );

        archive.append(buffer, {name: destFilename});
        // archive.append(createReadStream('mydir/file.txt'), {name:'file.txt'});
        // you can add a directory using directory function
        // archive.directory(dirPath, false);
        archive.finalize();

        // res.setHeader('content-type', image.getMIME());
        // res.write(buffer);
        // return res.end();
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<any>}
     * @constructor
     */
    async Download(req, res, next) {
        const srcFilename = req.query.srcFilename;
        const destFilename = req.query.srcFilename || 'download';

        if (!srcFilename) {
            return;
        }
        console.log(`srcFilename: ${srcFilename}`);

        const downloadPath = join(
            process.cwd(),
            'storages',
            'download',
            destFilename,
        );
        const resizePath = join(
            process.cwd(),
            'storages',
            'download',
            'resize',
            destFilename,
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
        // Downloads the file
        await this.storage
            .bucket(this.bucketName)
            .file(srcFilename)
            .download(options);

        console.log(
            `gs://${this.bucketName}/${srcFilename} downloaded to ${downloadPath}.`,
        );

        const imageHelper = new JimpImageHelper(downloadPath);

        const image = await imageHelper.applyMask4();

        // const resizedImage = await image.quality(100).writeAsync(resizePath);

        const mime = image.getMIME();
        const buffer = await image.quality(70).getBufferAsync(mime);

        res.setHeader('content-type', mime);
        res.write(buffer);
        return res.end();
    }

}
