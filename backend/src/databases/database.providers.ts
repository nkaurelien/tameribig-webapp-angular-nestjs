import mongoose from 'mongoose';
import {MONGO_DB_PROVIDER} from './constants';
import {ConfigModule} from '@core/config/ConfigModule';
import {ConfigService} from '@core/config/_services/ConfigService';

export const databaseProviders = [
    {
        imports: [ConfigModule.register()],
        inject: [ConfigService],
        provide: MONGO_DB_PROVIDER,
        useFactory: async (configService) => {
            (mongoose as any).Promise = global.Promise;
            return await mongoose.connect(configService.getEnv('MONGODB_URI'), {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            });
        },
    },
];
