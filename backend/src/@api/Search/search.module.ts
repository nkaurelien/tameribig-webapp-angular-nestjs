import {Module} from '@nestjs/common';
import {DatabaseModule} from '@databases/database.module';
import {searchProviders} from './search.providers';
import {NotificationsModule} from '@api/Notifications/notifications.module';
import {SearchService} from './search.service';
import {SearchController} from './search.controller';
import {SearchModel} from './search.model';
import {MediaImagesModule} from "@api/MediaImages/images.module";

@Module({
    imports: [
        SearchModel,
        DatabaseModule,
        NotificationsModule,
        MediaImagesModule,
    ],
    exports: [
        SearchService,
        ...searchProviders,
    ],
    controllers: [SearchController],
    providers: [SearchService, ...searchProviders],
})
export class SearchModule {
}
