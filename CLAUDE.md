# CLAUDE.md - Project Context for AI Assistants

## Project Overview

**Tameri Project** is a monorepo (pnpm workspaces) migrating from `tameribig-server` (NestJS 7 + MongoDB + Firebase) to a modern stack. The backend is functional with core modules migrated. The frontend is a placeholder.

## Tech Stack

| Component        | Technology              | Replaces (from tameribig-server)            |
| ---------------- | ----------------------- | ------------------------------------------- |
| Framework        | NestJS 11.1             | NestJS 7.6                                  |
| Language         | TypeScript 5.9 (strict) | TypeScript 4.1                              |
| Database         | CouchDB 3 (nano 11)     | MongoDB (Mongoose 5) + Firebase Realtime DB |
| Auth             | SuperTokens 24          | Firebase Auth + Passport Firebase           |
| Storage          | MinIO (S3-compatible)   | AWS S3 + Cloudinary + Google Cloud Storage  |
| Image Processing | imgproxy                | Sharp + JIMP                                |
| Cache            | Redis 7                 | Redis 5                                     |
| Logging          | Pino 10                 | Winston + Bugsnag                           |
| Linting          | ESLint 9                | TSLint                                      |
| Tests            | Jest 30 + Supertest 7   | Jest (older)                                |
| Build            | SWC                     | tsc                                         |
| Package Manager  | pnpm (workspaces)       | npm                                         |
| Runtime          | Node.js 20+             | Node.js 15                                  |

> **Note**: Zitadel OIDC est l'objectif final pour l'auth, SuperTokens est la solution intermédiaire actuelle.

## Monorepo Structure

```
tameri-project/
├── apps/
│   ├── backend/          # @tameri/backend - NestJS API
│   │   └── src/
│   │       ├── @core/    # Shared infrastructure (migrated)
│   │       ├── auth/     # SuperTokens authentication (migrated)
│   │       ├── users/    # User profiles on CouchDB (migrated)
│   │       ├── topics/   # Topics CRUD on CouchDB (migrated)
│   │       ├── media/    # Media management on CouchDB + MinIO (migrated)
│   │       ├── notifications/ # Notifications (partial)
│   │       ├── search/   # Search (partial)
│   │       ├── database/ # CouchDB connection (global module)
│   │       ├── storage/  # MinIO S3 + imgproxy (global module)
│   │       ├── app.module.ts
│   │       └── main.ts
│   └── frontend/         # @tameri/frontend - Placeholder (not started)
├── docker/               # DB init scripts
├── docker-compose.yml    # 7 services: app, postgres, supertokens, couchdb, minio, imgproxy, redis
├── Makefile              # Dev commands
├── pnpm-workspace.yaml
└── .env.example
```

## Key Patterns

### Database (CouchDB)

- Use `nano` client (not Mongoose)
- `CouchDbService` provides document CRUD, indexing, database creation
- `DatabaseModule` is `@Global()` — available everywhere
- Indexes are auto-created on module init (e.g. email, supertokensId, username)

### Auth (SuperTokens)

- Recipes: EmailPassword, Session, Dashboard, UserRoles
- `AuthGuard` + `@Roles()` decorator for route protection
- SuperTokens middleware injected globally
- PostgreSQL backend for SuperTokens data

### Storage (MinIO + imgproxy)

- `StorageService` uses AWS SDK v3 (S3 client)
- `StorageModule` is `@Global()`
- Signed URLs for upload/download
- imgproxy for image transformations (webp, avif, jpg, png)

### General

- `ResponseUtils` for consistent JSON responses
- DTOs with `class-validator` + `class-transformer`
- Global `ValidationPipe` (whitelist, transform, forbidNonWhitelisted)
- Swagger/OpenAPI at `/docs`
- Helmet + CORS (with SuperTokens headers)

## Commands

```bash
# Install
pnpm install                   # or: make install

# Development
pnpm run dev                   # or: make dev
pnpm run dev:backend           # or: make dev-backend

# Build
pnpm run build:backend         # or: make build-backend

# Test
pnpm run test:backend          # or: make test-backend
pnpm run test:e2e              # or: make test:e2e

# Lint
pnpm run lint                  # or: make lint
pnpm run format                # or: make format

# Docker
docker compose up -d           # or: make docker-up
docker compose down            # or: make docker-down

# Database
make db-setup                  # Initialize CouchDB databases
make db-list                   # List databases
```

## Docker Services (docker-compose.yml)

| Service     | Image          | Port(s)    | Purpose                  |
| ----------- | -------------- | ---------- | ------------------------ |
| tameri-app  | node:20        | 3000, 9229 | NestJS backend + debug   |
| postgres    | postgres:16    | 5432       | SuperTokens data         |
| supertokens | supertokens    | 3567       | Auth service             |
| couchdb     | couchdb:3.4.2  | 5984       | Document database        |
| minio       | minio          | 9000, 9001 | Object storage + console |
| imgproxy    | imgproxy       | 8080       | Image processing         |
| redis       | redis:7-alpine | 6379       | Cache                    |

Network: `tameri-network` (bridge). All services have health checks.

## Environment Variables (.env)

```
# App
PORT=3000
NODE_ENV=development
API_DOMAIN=http://localhost:3000
WEBSITE_DOMAIN=http://localhost:4200

# PostgreSQL (for SuperTokens)
POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT

# SuperTokens
SUPERTOKENS_CONNECTION_URI, SUPERTOKENS_API_KEY

# CouchDB
COUCHDB_USER, COUCHDB_PASSWORD, COUCHDB_URL, COUCHDB_PORT

# MinIO / S3
S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY

# Redis
REDIS_URL, REDIS_PORT

# imgproxy
IMGPROXY_URL, IMGPROXY_KEY, IMGPROXY_SALT
```

## Migration Status

### Completed

- [x] Monorepo structure (pnpm workspaces)
- [x] Docker infrastructure (7 services avec health checks)
- [x] `@core` module (config, guards, decorators, filters, exceptions, services, utils)
- [x] `database` module (CouchDB connection, CRUD, indexing)
- [x] `storage` module (MinIO S3 + imgproxy URL generation)
- [x] `auth` module (SuperTokens: EmailPassword, Session, Roles)
- [x] `users` module (CouchDB CRUD, profils complets, indexes)
- [x] `topics` module (CouchDB CRUD)
- [x] `media` module (CouchDB + MinIO file management)
- [x] Swagger/OpenAPI documentation
- [x] Global validation, security (Helmet, CORS)
- [x] Makefile, scripts, .env.example

### Partial (modules created, need completion)

- [ ] `notifications` — Module exists but push delivery (OneSignal) not integrated
- [ ] `search` — Module exists but full-text search not implemented for CouchDB
- [ ] `media` — Sentiment analysis not migrated

### Not Started

- [ ] **Frontend** (`apps/frontend/` is a placeholder) — see Frontend Migration section below
- [ ] **Email service** — Original had Nodemailer + Handlebars/Postmark templates
- [ ] **Zitadel OIDC** — Target auth system (currently using SuperTokens as intermediate)
- [ ] **Scheduler service** — Original had cron/scheduled tasks
- [ ] **Push notifications** — Original used OneSignal

## Frontend Migration

### Source Project

The original frontend is at `../tameribig-webapp-angular/` (Angular 8.2.14, 114 components, 57 modules). This code is **too obsolete to copy** — it serves as a **functional specification only**.

### Frontend Stack (new)

| Component | Technology                             | Replaces (from tameribig-webapp-angular) |
| --------- | -------------------------------------- | ---------------------------------------- |
| Framework | Angular 19+ (standalone components)    | Angular 8 (NgModules)                    |
| State     | Angular Signals + NgRx Signal Store    | Akita + NgRx 7 (mixed)                   |
| Styling   | Tailwind CSS 4 + Angular CDK           | MDB UIKit Pro + Material + jQuery        |
| Auth      | SuperTokens (HttpClient + interceptor) | Firebase Auth + @angular/fire            |
| Storage   | MinIO via backend API                  | Cloudinary + Firebase Storage            |
| i18n      | @ngx-translate or Angular built-in     | @ngx-translate 11                        |
| Build     | esbuild (Angular CLI)                  | Webpack                                  |
| Tests     | Jest or Vitest                         | Karma + Jasmine                          |
| Linting   | ESLint 9                               | TSLint                                   |

### Modules to Migrate (priority order)

| Priority | Module                                  | Original source          | Backend endpoints             | Status      |
| -------- | --------------------------------------- | ------------------------ | ----------------------------- | ----------- |
| P1       | Auth (login, register, forgot-password) | `src/@core/auth/`        | `/auth/*` (SuperTokens)       | Not started |
| P1       | Home / Landing page                     | `src/app/main/home/`     | `/api/topics`, `/api/media`   | Not started |
| P2       | Explorer (images, videos, audio)        | `src/app/main/explorer/` | `/api/media`                  | Not started |
| P2       | Search + suggestions                    | `src/app/main/search/`   | `/api/search/suggestions`     | Not started |
| P3       | Topics / Categories                     | `src/app/main/category/` | `/api/topics`                 | Not started |
| P3       | Console (user dashboard)                | `src/app/main/console/`  | `/api/users/me`, `/api/media` | Not started |
| P4       | Corporate pages (about, FAQ, contact)   | `src/app/coorporate/`    | N/A (static)                  | Not started |
| P4       | Network (social features)               | `src/app/main/network/`  | `/api/users`                  | Not started |

### Original Routes (reference)

```
/auth/login, /auth/register, /auth/forgot-password, /auth/logout
/home
/explorer (images, videos, audio, creations)
/search
/topics
/console
/coorporate (about, services, contact, faq, recruitment, privacy)
/network
```

### Migration Workflow (per module)

1. Analyze the original Angular 8 module in `../tameribig-webapp-angular/`
2. Identify the corresponding backend endpoints in `apps/backend/`
3. Design new Angular 19 standalone components with signals
4. Implement with Tailwind CSS + Angular CDK
5. Connect to backend API via HttpClient + SuperTokens auth
6. Write component + integration tests
7. Update this migration status table

## Source Project Reference

The original project is at `../tameribig-server/` (same parent directory). Key locations:

- Original API modules: `tameribig-server/src/@api/`
- Original core: `tameribig-server/src/@core/`
- Original schemas (Mongoose): `tameribig-server/src/@api/*/_.schema.ts`
- Original services: `tameribig-server/src/@core/services/`
- Email templates: `tameribig-server/src/resources/views/`

## Notes for AI

- **This is a migration project** — refer to `../tameribig-server/` for original implementation details
- Use **NestJS 11** patterns (not NestJS 7 — no `@nestjs/mongoose`, no `forwardRef` unless necessary)
- **CouchDB** is document-based like MongoDB but uses `nano` client, not Mongoose
- **SuperTokens** is the current auth — use its middleware and guards (Zitadel OIDC is a future goal)
- **MinIO** is S3-compatible — use `@aws-sdk/client-s3` v3
- **Global modules**: `DatabaseModule` and `StorageModule` are `@Global()`, no need to import them in feature modules
- Prefer **pnpm** for package management, **SWC** for builds
- Run `make docker-up` before `make dev` to start all dependencies
