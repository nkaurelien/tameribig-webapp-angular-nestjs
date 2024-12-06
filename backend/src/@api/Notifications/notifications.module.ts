import {DynamicModule, Module} from '@nestjs/common';
import {DatabaseModule} from '@databases/database.module';
import {notificationsProviders} from "./notifications.providers";
import {NotificationsService} from "./notifications.service";
import {NotificationsController} from "./notifications.controller";
import {NotificationsModel} from "./notifications.model";

@Module({
    imports: [
        NotificationsModel,
        DatabaseModule,
    ],
    controllers: [NotificationsController],
    exports: [NotificationsService, ...notificationsProviders],
    providers: [NotificationsService, ...notificationsProviders],
})


export class NotificationsModule {
    static register(): DynamicModule {
        return {
            module: NotificationsModule,
            exports: [NotificationsService, ...notificationsProviders],
            providers: [NotificationsService, ...notificationsProviders],
        };
    }
}
