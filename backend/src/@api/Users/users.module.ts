import {Module} from '@nestjs/common';
import {DatabaseModule} from '@databases/database.module';
import {UsersService} from './users.service';
import {usersProviders} from './users.providers';
import {UserController} from './user.controller';
import {UsersModel} from "./users.model";
import {NotificationsModule} from "@api/Notifications/notifications.module";

@Module({
    imports: [
        UsersModel,
        DatabaseModule,
        NotificationsModule,
    ],
    exports: [
        UsersService,
        ...usersProviders
    ],
    controllers: [UserController],
    providers: [UsersService, ...usersProviders],
})
export class UsersModule {
}
