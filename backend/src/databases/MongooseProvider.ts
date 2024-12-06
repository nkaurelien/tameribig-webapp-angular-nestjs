import {ConfigModule} from "@core/config/ConfigModule";
import {ConfigService} from "@core/config/_services/ConfigService";

export class MongooseProvider {
    static readonly asyncOptions = {
        imports: [ConfigModule.register()],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            uri: configService.getEnv('MONGODB_URI'),
            useUnifiedTopology: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useCreateIndex: true,
        }),
    };
}
