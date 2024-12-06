import * as dotenv from 'dotenv';
import * as fs from 'fs';
import {IAwsConfigInterface} from '../../interfaces/aws-config.interface';
import path from 'path';

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

export interface EnvConfig {
    [key: string]: string;
}

export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor(
        // @Inject(CONFIG_OPTIONS) private options
    ) {
        const filePath = '.' + `${process.env.NODE_ENV || 'development'}.env`;
        const envFile = path.resolve('src/environments', filePath);

        this.envConfig = dotenv.parse(fs.readFileSync(envFile));

    }

    get nodeEnv(): string {
        return this.get('NODE_ENV') || 'development';
    }

    get isApiAuthEnabled(): boolean {
        return Boolean(this.envConfig.API_AUTH_ENABLED);
    }

    get awsS3Config(): IAwsConfigInterface {
        return {
            accessKeyId: this.get('AWS_S3_ACCESS_KEY_ID'),
            secretAccessKey: this.get('AWS_S3_SECRET_ACCESS_KEY'),
            bucketName: this.get('S3_BUCKET_NAME'),
        };
    }

    get(key: string): string {
        return this.getEnv(key);
    }

    getEnv(key: string): string {
        return this.envConfig[key];
    }

    public getNumber(key: string): number {
        return Number(this.get(key));
    }

    /**
     * Ensures all needed variables are set, and returns the validated JavaScript object
     * including the applied default values.
     */
    // private static validateInput(envConfig: EnvConfig): EnvConfig {
    //     const envVarsSchema: Joi.ObjectSchema = Joi.object({
    //         NODE_ENV: Joi.string()
    //             .valid(['development', 'production', 'test', 'provision'])
    //             .default('development'),
    //         PORT: Joi.number().default(3000),
    //         API_AUTH_ENABLED: Joi.boolean().required(),
    //     });
    //
    //     const {error, value: validatedEnvConfig} = Joi.validate(
    //         envConfig,
    //         envVarsSchema,
    //     );
    //     if (error) {
    //         console.log(error);
    //         throw new Error(`Config validation error: ${error.message}`);
    //     }
    //     return validatedEnvConfig;
    // }
}
