import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

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
