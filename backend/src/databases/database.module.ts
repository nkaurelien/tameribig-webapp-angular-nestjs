import {Module} from '@nestjs/common';
import {databaseProviders} from './database.providers';
import {ConfigModule} from '@core/config/ConfigModule';

@Module({
    imports: [
        ConfigModule.register(),
    ],
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {
}

