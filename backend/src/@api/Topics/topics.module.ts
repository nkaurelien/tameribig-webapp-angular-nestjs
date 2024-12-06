import {Module} from '@nestjs/common';
import {DatabaseModule} from '@databases/database.module';
import {TopicsController} from './topics.controller';
import {TopicsService} from './topics.service';
import {topicsProviders} from './topics.providers';
import {TopicsFirebaseService} from "./topics-firebase.service";
import {TopicsMongodbService} from "./topics-mongodb.service";
import {GeneratorService} from "@core/services/generator.service";
import {TopicModel} from "./topics.model";
import {ConfigModule} from "@core/config/ConfigModule";
import {ConfigService} from "@core/config/_services/ConfigService";

@Module({
    imports: [
        TopicModel,
        DatabaseModule,
        ConfigModule.register(),
    ],
    controllers: [TopicsController,],
    providers: [TopicsMongodbService, TopicsFirebaseService, TopicsService, ConfigService, GeneratorService, ...topicsProviders],
})
export class TopicsModule {
}
