import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        autoLogging: false, // Disable auto HTTP logging to avoid path-to-regexp warning
      },
      // Empty arrays to prevent default wildcard routes
      forRoutes: [],
      exclude: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
