import {DynamicModule, Module} from '@nestjs/common';
import {CONFIG_OPTIONS, ConfigService} from './_services/ConfigService';

@Module({
    // providers: [
    //     {
    //         provide: ConfigService,
    //         // useValue: new ConfigService(`src/environments/.env`),
    //         useValue: new ConfigService(
    //             process.env.NODE_ENV ? `src/environments/.${process.env.NODE_ENV}.env` : `src/environments/.env`,
    //         ),
    //     },
    // ],
    // providers: [ConfigService],
    // exports: [ConfigService],
})
export class ConfigModule {
    static register(options = {}): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options,
                },
                ConfigService,
            ],
            exports: [ConfigService],
        };
    }
}
