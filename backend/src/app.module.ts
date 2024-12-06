import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersModule} from '@api/Users/users.module';
import {MediaImagesModule} from '@api/MediaImages/images.module';
import {ConfigModule} from '@core/config/ConfigModule';
import {AuthModule} from '@api/Auth/auth.module';
import {TopicsModule} from '@api/Topics/topics.module';
import {join} from 'path';
import {ServeStaticModule} from '@nestjs/serve-static';
import {NotificationsModule} from '@api/Notifications/notifications.module';
import {MongooseProvider} from '@databases/MongooseProvider';
import {MailerModule} from '@nestjs-modules/mailer';
import {BugsnagModule} from '@nkaurelien/nest-bugsnag';
import BugsnagPluginExpress from '@bugsnag/plugin-express';
import {SearchModule} from '@api/Search/search.module';
import {MailerProvider} from './providers/mailer.providers';

@Module({
    imports: [

        MailerModule.forRoot(MailerProvider.forRootOptions),

        ConfigModule,
        // MongooseModule.register(environment.MONGODB_URI),
        MongooseModule.forRootAsync(MongooseProvider.asyncOptions),
        TopicsModule,
        MediaImagesModule,
        SearchModule,
        NotificationsModule.register(),
        UsersModule,
        AuthModule,

        BugsnagModule.forRoot({
            apiKey: 'be426ac94b73c1f6c4c22363b7852bfe',
            plugins: [BugsnagPluginExpress],
        }),

        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'storages'),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
