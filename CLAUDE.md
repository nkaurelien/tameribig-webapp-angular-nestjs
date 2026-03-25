# CLAUDE.md - Project Context for AI Assistants

## Project Overview

**Tameri Project** is a monorepo (pnpm workspaces) migrating from `tameribig-server` (NestJS 7 + MongoDB + Firebase) to a modern stack. The backend is functional with core modules migrated. The frontend is functional with auth, media management, explorer, and info pages implemented.

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
│   └── frontend/         # @tameri/frontend - Angular 19 + DaisyUI 5
│       └── src/app/
│           ├── core/         # Auth, services, interceptors, site.config
│           ├── features/     # Feature modules (auth, console, explorer, home, info, media-detail, search, topics)
│           ├── layouts/      # Auth layout, main layout
│           ├── shared/       # Components (media-card, navigation, footer), models
│           └── store/        # NgRx Signal Stores (auth, user)
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

- [ ] **Email service** — Original had Nodemailer + Handlebars/Postmark templates (email-templates.ts created, needs SMTP)
- [ ] **Zitadel OIDC** — Target auth system (currently using SuperTokens as intermediate)
- [ ] **Scheduler service** — Original had cron/scheduled tasks
- [ ] **Push notifications** — Original used OneSignal
- [ ] **Network** (social features) — `/api/users` public profiles

## Frontend Migration

### Source Project

The original frontend is at `../tameribig-webapp-angular/` (Angular 8.2.14, 114 components, 57 modules). This code is **too obsolete to copy** — it serves as a **functional specification only**.

### Frontend Stack (new)

| Component | Technology                               | Replaces (from tameribig-webapp-angular) |
| --------- | ---------------------------------------- | ---------------------------------------- |
| Framework | Angular 19+ (standalone components)      | Angular 8 (NgModules)                    |
| State     | Angular Signals + NgRx Signal Store      | Akita + NgRx 7 (mixed)                   |
| Styling   | Tailwind CSS 4 + DaisyUI 5 + Angular CDK | MDB UIKit Pro + Material + jQuery        |
| Auth      | SuperTokens (HttpClient + interceptor)   | Firebase Auth + @angular/fire            |
| Storage   | MinIO via backend API                    | Cloudinary + Firebase Storage            |
| i18n      | @ngx-translate or Angular built-in       | @ngx-translate 11                        |
| Build     | esbuild (Angular CLI)                    | Webpack                                  |
| Tests     | Jest or Vitest                           | Karma + Jasmine                          |
| Linting   | ESLint 9                                 | TSLint                                   |

### Modules to Migrate (priority order)

| Priority | Module                                                  | Original source          | Backend endpoints                           | Status      |
| -------- | ------------------------------------------------------- | ------------------------ | ------------------------------------------- | ----------- |
| P1       | Auth (login, register, forgot-password, reset-password) | `src/@core/auth/`        | `/auth/*` (SuperTokens)                     | Done        |
| P1       | Home / Landing page                                     | `src/app/main/home/`     | `/api/topics`, `/api/media`                 | Done        |
| P2       | Explorer (images, videos, audio)                        | `src/app/main/explorer/` | `/api/media`                                | Done        |
| P2       | Media detail + download                                 | N/A (new)                | `/api/media/:id`, `/api/media/:id/download` | Done        |
| P2       | Search + suggestions                                    | `src/app/main/search/`   | `/api/search/suggestions`                   | Done        |
| P3       | Topics / Categories                                     | `src/app/main/category/` | `/api/topics`                               | Done        |
| P3       | Console (profile, media CRUD, settings)                 | `src/app/main/console/`  | `/api/users/me`, `/api/media`               | Done        |
| P4       | Info pages (about, FAQ, contact, privacy, terms)        | `src/app/coorporate/`    | N/A (static)                                | Done        |
| P4       | Network (social features)                               | `src/app/main/network/`  | `/api/users`                                | Not started |

### Current Routes (implemented)

```
/auth/login, /auth/register, /auth/forgot-password, /auth/reset-password, /auth/logout
/home
/explorer (images, videos, audio)
/media/:id (detail + download)
/search
/topics, /topics/:slug
/console (profile, media/list, media/upload, media/:id/edit, settings)
/info (about, contact, faq, privacy, terms)
```

### Not Yet Implemented

```
/network (social features)
```

### Frontend Key Patterns

- **DaisyUI 5** as Tailwind CSS plugin — custom "tameri" theme (indigo primary) in `styles.css`
- **`siteConfig`** (`core/site.config.ts`) — centralized site constants (name, email, domain, social, legal, media settings)
- **Standalone components** with Angular Signals for reactive state
- **NgRx Signal Store** for auth and user state (`store/auth.store.ts`, `store/user.store.ts`)
- **SuperTokens** cookie-based auth via `authInterceptor` + `authGuard`
- **`MediaApiService`** for all media operations (CRUD, upload, download, upvote)
- **`ApiService`** as generic HTTP wrapper with base URL from environment

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
- **DaisyUI 5** is the UI component library — use DaisyUI classes (`btn`, `card`, `input`, `alert`, etc.) not raw Tailwind for UI components
- **`siteConfig`** is the single source of truth for site-wide constants — don't hardcode emails, domain, or social links
