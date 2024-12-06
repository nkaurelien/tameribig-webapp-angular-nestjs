/* tslint:disable:no-console */
import {join} from 'path';
import * as lo from 'lodash';
import pluralize from 'pluralize';
import fs = require("fs");


export const MULTER_CONFIG = {
    destination: (req: any, file: any, cb: any) => {
        const mimetype = file.mimetype.split('/');
        // console.log({mimetype});

        const directory = mimetype[0];

        let subdirectory = '';
        if (file.mimetype.includes('images')) {
            subdirectory = ``;
        } else if (file.mimetype.includes('zip')) {
            subdirectory = `zip`;
        } else {
            subdirectory = `${mimetype[1]}`;
        }
        const dir = join(process.cwd(), 'storages', 'upload', pluralize(directory), subdirectory);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }

        cb(null, dir);
    },
    filename: (req: any, file: any, cb: any) => {
        delete req.headers.authorization;

        const mimetype = file.mimetype.split('/');
        // console.log({mimetype});

        const type = mimetype[0];

        let ext = '';
        // ext = ImageHelper.extractExtension(file.originalname);
        //
        if (file.mimetype.includes('images')) {
            ext = ``;
        } else if (file.mimetype.includes('zip')) {
            ext = `.zip`;
        } else {
            ext = `.${mimetype[1]}`;
        }

        let filename = `${new Date().getTime()}`.toUpperCase() + ext;
        filename = lo.padStart(filename, 25, '0');
        cb(null, filename);
    },
};
