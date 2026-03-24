# Stack technique

## Backend

| Composant         | Technologie            | Version  | Remplace             |
| ----------------- | ---------------------- | -------- | -------------------- |
| Framework         | NestJS                 | 11.1     | NestJS 7.6           |
| Langage           | TypeScript (strict)    | 5.9      | TypeScript 4.1       |
| Base de données   | CouchDB (nano)         | 3.4      | MongoDB (Mongoose 5) |
| Auth              | SuperTokens            | 24       | Firebase Auth        |
| Stockage objet    | MinIO (AWS SDK v3)     | latest   | AWS S3 + Cloudinary  |
| Traitement images | imgproxy               | latest   | Sharp + JIMP         |
| Cache             | Redis                  | 7-alpine | Redis 5              |
| Logging           | Pino                   | 10       | Winston              |
| Build             | SWC                    | latest   | tsc                  |
| Tests             | Jest 30 + Supertest 7  | —        | —                    |
| Linting           | ESLint 9 (flat config) | —        | TSLint               |

## Frontend

| Composant        | Technologie                         | Version | Remplace         |
| ---------------- | ----------------------------------- | ------- | ---------------- |
| Framework        | Angular (standalone)                | 19      | Angular 8        |
| UI Components    | PrimeNG                             | 21      | MDB UIKit Pro    |
| CSS              | Tailwind CSS + tailwindcss-primeui  | 4       | SCSS + Bootstrap |
| State management | Angular Signals + NgRx Signal Store | 19      | Akita + NgRx 7   |
| Auth             | supertokens-web-js                  | latest  | Firebase Auth    |
| Tests            | Jest / Vitest                       | —       | Karma + Jasmine  |
| Build            | esbuild (Angular CLI)               | —       | Webpack          |

## Infrastructure

| Service          | Image Docker       | Port(s)    | Rôle                      |
| ---------------- | ------------------ | ---------- | ------------------------- |
| Backend (NestJS) | node:20            | 3000, 9229 | API REST + debug          |
| PostgreSQL       | postgres:16-alpine | 5432       | Données SuperTokens       |
| SuperTokens      | supertokens        | 3567       | Service d'auth            |
| CouchDB          | couchdb:3.4.2      | 5984       | Base de données documents |
| MinIO            | minio/minio        | 9000, 9001 | Stockage S3 + console     |
| imgproxy         | imgproxy           | 8080       | Transformation d'images   |
| Redis            | redis:7-alpine     | 6379       | Cache                     |

## Outils de développement

| Outil           | Usage                        |
| --------------- | ---------------------------- |
| pnpm            | Package manager + workspaces |
| Docker Compose  | Orchestration des services   |
| Makefile        | Raccourcis de commandes      |
| Husky           | Git hooks (pre-commit)       |
| lint-staged     | Lint des fichiers staged     |
| Prettier        | Formatage du code            |
| Swagger/OpenAPI | Documentation API            |
| Docsify         | Documentation projet         |
