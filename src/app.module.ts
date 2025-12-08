import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/index.js';
import { CoreModule } from './@core/index.js';
import { DatabaseModule } from './database/index.js';
import { UsersModule } from './users/index.js';
import { NotificationsModule } from './notifications/index.js';

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        autoLogging: false,
      },
      forRoutes: [],
      exclude: [],
    }),
    AuthModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
