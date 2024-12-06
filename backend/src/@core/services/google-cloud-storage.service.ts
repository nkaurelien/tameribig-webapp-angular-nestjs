import {Injectable} from '@nestjs/common';
import {ConfigService} from '../config/_services/ConfigService';
import {GeneratorService} from './generator.service';
import {dirname, join} from "path";
import {environment} from "@environments/environment";
import * as admin from "firebase-admin";
import {GoogleCloudStorageRepository} from "@core/classes/GoogleCloudStorageRepository";
import {existsSync, mkdirSync} from "fs";
import archiver from 'archiver';

@Injectable()
export class GoogleCloudStorageService {
    private readonly _instance: any;
    private bucketName = environment.firebaseConfig.storageBucket;
    private storage: admin.storage.Storage;
    private repo: GoogleCloudStorageRepository;

    constructor(
        public configService: ConfigService,
        public generatorService: GeneratorService,
    ) {

        // var bucket = admin.storage().bucket();

        this._instance = admin.storage();
        this.storage = admin.storage();
        this.repo = new GoogleCloudStorageRepository()
    }

    get instance() {
        return this._instance;
    }

    async uploadRawFileV2(file, fileID: string): Promise<any> {

    }

    async uploadRawFile(file_path: string, fileID: string): Promise<any> {

        return new Promise(async (resolve, reject) => {

            try {
                const result = await this.repo.upload(file_path);
                resolve(result);
            } catch (e) {
                reject(e);
                console.log(e);
            }
        });
    }


    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<any>}
     * @constructor
     */
    async downloadStream(req, res, next): Promise<any> {
        const srcFilename = req.query.srcFilename;
        console.log(`srcFilename: ${srcFilename}`);
        return await this.repo.downloadStream(srcFilename, res, (err) => {
            next(err);
        })
    }

    async downloadZipped(req, res, next): Promise<any> {
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
        const [buffer] = await this.storage
            .bucket(this.bucketName)
            .file(srcFilename)
            .download(options);
        // const imageHelper = new JimpImageHelper(downloadPath);
        //
        // const image = await imageHelper.applyMask4();

        // const resizedImage = await image.quality(100).writeAsync(resizePath);
        // const mime = image.getMIME();
        // const buffer = await image.quality(100).getBufferAsync(mime);

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
                // `Type       ${mime}`,
                `Categorie  Africa`,
                `Download   1`,
                '',
                '----------------------------------',
                '',
                'Visit:',
                'tameribig.com',
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

}
