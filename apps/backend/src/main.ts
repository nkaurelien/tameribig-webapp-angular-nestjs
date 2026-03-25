import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import supertokens from 'supertokens-node';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import { middleware } from 'supertokens-node/framework/express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // SuperTokens middleware — must run before global prefix and routing
  app.use(middleware());

  // Security
  app.use(helmet());

  // CORS with SuperTokens headers
  const websiteDomain = process.env.WEBSITE_DOMAIN || 'http://localhost:3000';
  app.enableCors({
    origin: [websiteDomain],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  // SuperTokens exception filter
  app.useGlobalFilters(new SuperTokensExceptionFilter());

  // Global prefix
  const globalPrefix = process.env.APP_ROUTE_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Tameri API')
    .setDescription('Tameri Project REST API documentation')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'openapi.json',
    explorer: true,
  });

  // Start server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║           Tameri API Server Started                   ║
  ╠═══════════════════════════════════════════════════════╣
  ║  URL:      ${await app.getUrl()}
  ║  Docs:     ${await app.getUrl()}/docs
  ║  OpenAPI:  ${await app.getUrl()}/openapi.json
  ╚═══════════════════════════════════════════════════════╝
  `);
}

void bootstrap();
