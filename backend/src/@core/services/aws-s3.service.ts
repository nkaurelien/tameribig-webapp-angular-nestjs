import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '../config/_services/ConfigService';
import {GeneratorService} from './generator.service';
import {IFile} from '../interfaces/IFile';

@Injectable()
export class AwsS3Service {
    private readonly _s3: AWS.S3;

    constructor(
        public configService: ConfigService,
        public generatorService: GeneratorService,
    ) {
        const options: AWS.S3.Types.ClientConfiguration = {
            apiVersion: '2010-12-01',
            region: 'eu-central-1',
        };

        const awsS3Config = configService.awsS3Config;
        if (awsS3Config.accessKeyId && awsS3Config.secretAccessKey) {
            options.credentials = awsS3Config;
        }

        this._s3 = new AWS.S3(options);
    }

    async uploadImage(file: IFile) {
        const fileName = this.generatorService.fileName(<string>(
            mime.extension(file.mimetype)
        ));
        const key = 'images/' + fileName;
        await this._s3
            .putObject({
                Bucket: this.configService.awsS3Config.bucketName,
                Body: file.buffer,
                ACL: 'public-read',
                Key: key,
            })
            .promise();

        return key;
    }
}
