/* tslint:disable:no-console no-var-requires */

require('module-alias/register');

import {BugsnagService} from '@nkaurelien/nest-bugsnag';
import {NestFactory, Reflector} from '@nestjs/core';
import {AppLogger} from '@core/exceptions/AppLogger';
import {AppModule} from './app.module';
import * as admin from 'firebase-admin';
import {environment} from '@environments/environment';
import {join} from 'path';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import {HttpExceptionFilter} from '@core/filters/bad-request.filter';
import {QueryFailedFilter} from '@core/filters/query-failed.filter';
import {NestExpressApplication} from '@nestjs/platform-express';
import {AppMvcModule} from './app-mvc.module';
import {allowedOrigin} from './@api/cors';

declare const module: any;

// declare function require(s: string): any;

const googleServiceAccountFile = join(process.cwd(), 'tameri-big-02050d7b516f.json');

admin.initializeApp({
    credential: admin.credential.cert(googleServiceAccountFile),
    // credential: admin.credential.cert(JSON.stringify(serviceAccount)),
    storageBucket: environment.firebaseConfig.storageBucket,
});

// var bucket = admin.storage().bucket();

async function bootstrap() {
    const KO = 'Oops, Nothing Here :)';

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new AppLogger(),
        // logger: false,
    });
    // app.useLogger(app.get(BugsnagLogger));

    app.enableCors({
        origin: allowedOrigin,
    });

    app.use(helmet());

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // limit each IP to 100 requests per windowMs
        }),
    );

    const reflector = app.get(Reflector);

    app.useGlobalFilters(
        new HttpExceptionFilter(reflector),
        new QueryFailedFilter(reflector),
    );

    app.setGlobalPrefix(process.env.APP_ROUTE_PREFIX || '');

    // DENY KNOWN REST API VULNERABILITIES
    app.use(helmet.hidePoweredBy({setTo: 'PHP/5.3.2'}));
    app.use(helmet.frameguard({action: 'deny'}));
    app.use(helmet.noSniff());

    // APPLICATION LAYER DDOS PROTECTION
    // const ddos = new Ddos({ burst: 10, limit: 15 });
    // process.env.NODE_ENV === 'production' ? app.use(ddos.express) : noop();

    console.log({NODE_ENV: process.env.NODE_ENV});

    // CRAWL DENIAL FOR SEARCH ENGINES
    app.use('/robots.txt', (requset: any, response: any) =>
        response.type('text/plain').send('User-agent: *\nDisallow: /'),
    );

    // HEALTH CHECK URL @ index.html
    app.use('/index.html', (request: any, response: any) => response.send(KO));

    // ADD SUPPORT FOR BODY/URL-ENCODED REST APIs
    app.use(bodyParser.urlencoded({extended: true, limit: '8mb'}));
    app.use(bodyParser.json({limit: '8mb'}));

    // MORGAN LOGGER
    // app.use(morgan('combined'));

    // const configService = app.select(ConfigModule).get(ConfigService);
    //
    // const ENV = configService.getEnv('NODE_ENV');
    // console.log({ENV});
    // if (['development', 'staging'].includes(ENV)) {
    //     // initDocumentation(app, {
    //     //     version: '0.0.1',
    //     //     description: 'TAMERIBIG API DOCUMENTATION',
    //     //     title: 'Api documentation and references',
    //     //     endpoint: '/docs',
    //     // });
    // }

    app.get(BugsnagService).handleAnyErrors(app);

    await app.listen(process.env.PORT || 3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

async function bootstrapMVC() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppMvcModule,
    );

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(csurf({cookie: true}));
    app.useStaticAssets(join(process.cwd(), 'storages'));

    // app.setBaseViewsDir(join(process.cwd(), 'views'));
    // app.setViewEngine('hbs');

    // error handler
    app.use((err, req, res, next) => {
        if (err.code !== 'EBADCSRFTOKEN') {
            return next(err);
        }
        // handle CSRF token errors here
        res.status(403);
        res.send('form tampered with');
    });

    await app.listen(process.env.PORT + 1 || 3001);
}

bootstrap();
bootstrapMVC();
