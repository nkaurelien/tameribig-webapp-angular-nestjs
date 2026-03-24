<!-- Sync Impact Report
  ==================================================
  Version change: 1.0.0 → 2.0.0
  Modified principles:
    - I. Migration Fidelity → expanded to cover frontend migration from tameribig-webapp-angular
    - II. Modern NestJS Patterns → renamed to "Modern Stack Only" (covers backend + frontend)
  Added sections:
    - Frontend Technical Decisions (under Technology Constraints)
    - Migration & Modernization Workflow (frontend-specific)
    - Frontend migration priority order (under Principle VI)
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ aligned
    - .specify/templates/spec-template.md ✅ aligned
    - .specify/templates/tasks-template.md ✅ aligned
  Follow-up TODOs: None
  ==================================================
-->

# Tameri Project Constitution

## Core Principles

### I. Monorepo-First

All applications and shared libraries MUST live in the `tameri-project` monorepo under pnpm workspaces. No separate repositories for frontend, backend, or shared code. The workspace structure is:

- `apps/backend` — NestJS API (`@tameri/backend`)
- `apps/frontend` — Angular web app (`@tameri/frontend`)
- `libs/shared` — Shared types, DTOs, interfaces (future, when needed)

Rationale: Single source of truth, atomic commits across frontend+backend, shared tooling (ESLint, Prettier, Husky).

### II. Modern Stack Only

Every technology choice MUST use the current generation. Legacy code from the original projects (`tameribig-webapp-angular`, `tameribig-server`) MUST NOT be copied as-is — it MUST be rewritten using modern equivalents:

| Domain             | MUST Use                                          | MUST NOT Use                            |
| ------------------ | ------------------------------------------------- | --------------------------------------- |
| Backend framework  | NestJS 11+                                        | NestJS 7                                |
| Frontend framework | Angular 19+ (standalone components, signals)      | Angular 8, AngularJS                    |
| Database           | CouchDB 3 (nano client)                           | MongoDB, Mongoose, Firebase Realtime DB |
| Auth               | SuperTokens 24 (then Zitadel OIDC)                | Firebase Auth, Passport-Firebase        |
| Object storage     | MinIO (S3-compatible, AWS SDK v3)                 | Cloudinary, Firebase Storage, AWS S3    |
| Image processing   | imgproxy                                          | Sharp, JIMP                             |
| State management   | Angular Signals / NgRx Signal Store               | Akita, NgRx 7, mixed patterns           |
| CSS/UI             | Tailwind CSS 4 + Angular CDK                      | MDB UIKit Pro, ng-bootstrap, jQuery     |
| Package manager    | pnpm                                              | npm, yarn                               |
| Build              | SWC (backend), esbuild (frontend via Angular CLI) | tsc, Webpack                            |
| Linting            | ESLint 9 (flat config)                            | TSLint                                  |
| Testing backend    | Jest 30 + Supertest                               | Karma, Jasmine                          |
| Testing frontend   | Jest or Vitest                                    | Karma, Jasmine                          |
| Logger             | Pino 10                                           | Winston, Bunyan, console.log            |
| Runtime            | Node.js 20+                                       | Node.js < 20                            |

### III. Document-Database-First Design

CouchDB is the primary data store. All data access MUST use the `nano` client via `CouchDbService`. ORM patterns (repositories, schemas, migrations) MUST NOT be introduced. Indexes MUST be created declaratively on module initialization. Document structures MUST be defined as TypeScript interfaces, not class-based schemas.

### IV. Strict TypeScript & Validation

TypeScript strict mode MUST be enabled. DTOs MUST use `class-validator` and `class-transformer` decorators. The global `ValidationPipe` MUST enforce `whitelist`, `transform`, and `forbidNonWhitelisted`. API responses MUST use `ResponseUtils` for consistent JSON structure. Swagger/OpenAPI decorators MUST be present on all controller endpoints.

### V. Infrastructure as Docker Services

All runtime dependencies (PostgreSQL, SuperTokens, CouchDB, MinIO, imgproxy, Redis) MUST be defined in `docker-compose.yml` with health checks. Local development MUST NOT require installing these services natively. New services MUST join the `tameri-network` bridge and MUST include a health check definition. `make docker-up` MUST be run before `make dev`.

### VI. Incremental Migration

Migration from the original projects MUST be done module by module, not big-bang. Each module MUST be functional and tested before starting the next.

**Backend (completed):** auth → database → users → topics → media → storage → notifications → search

**Frontend (not started) — priority order:**

| Priority | Module                                  | Source (tameribig-webapp-angular) | Backend endpoints             |
| -------- | --------------------------------------- | --------------------------------- | ----------------------------- |
| P1       | Auth (login, register, forgot-password) | `src/@core/auth/`                 | `/auth/*` (SuperTokens)       |
| P1       | Home / Landing page                     | `src/app/main/home/`              | `/api/topics`, `/api/media`   |
| P2       | Explorer (images, videos, audio)        | `src/app/main/explorer/`          | `/api/media`                  |
| P2       | Search + suggestions                    | `src/app/main/search/`            | `/api/search/suggestions`     |
| P3       | Topics / Categories                     | `src/app/main/category/`          | `/api/topics`                 |
| P3       | Console (user dashboard)                | `src/app/main/console/`           | `/api/users/me`, `/api/media` |
| P4       | Corporate pages (about, FAQ, contact)   | `src/app/coorporate/`             | N/A (static)                  |
| P4       | Network (social features)               | `src/app/main/network/`           | `/api/users`                  |

### VII. Test Discipline

Unit tests (Jest) and e2e tests (Supertest) MUST exist for all backend service modules. Frontend MUST have component tests + integration tests for critical flows (auth, navigation). Tests MUST be runnable via `pnpm run test:backend`, `pnpm run test:frontend`, and `pnpm run test:e2e`.

### VIII. API-Contract Alignment

Frontend and backend MUST share the same data contracts. DTOs, interfaces, and enums used in API requests/responses SHOULD be defined once and shared (via `libs/shared` or co-located types). Swagger/OpenAPI documentation at `/docs` is the source of truth for the API surface.

Rationale: The original Angular app had duplicated and divergent type definitions from the backend.

## Technology Constraints

### Source Projects Reference

The original implementations serve as **functional specifications only** (not code to copy):

- `../tameribig-webapp-angular/` — Angular 8 frontend (114 components, 57 modules)
  - Key features to reimplement: auth, home, explorer (images/videos/audio), search, topics, console, corporate pages
  - API patterns: REST calls to `/api/*`, JWT auth via interceptor
  - Routes: `/auth/*`, `/home`, `/explorer/*`, `/search`, `/topics/*`, `/console/*`, `/coorporate/*`
  - State management: Akita (images, search) + NgRx (router) + RxJS services — all to be replaced by Angular Signals
  - UI: MDB UIKit Pro + Material + FontAwesome — to be replaced by Tailwind CSS 4 + Angular CDK

- `../tameribig-webapp-angular-nestjs/` — NestJS 11 backend (already migrated into monorepo)
  - This is the direct source of `apps/backend/` — migration complete

- `../tameribig-server/` — Original NestJS 7 backend (legacy reference)

### Frontend Technical Decisions

- Angular 19+ with **standalone components** (no NgModules unless necessary)
- **Angular Signals** for local state, **NgRx Signal Store** for shared/complex state
- **Tailwind CSS 4** for styling (utility-first, no component library lock-in)
- **Angular CDK** for accessible UI primitives (overlays, drag-drop, virtual scroll)
- **SSR optional** — can be added later with Angular Universal if SEO requires it
- **i18n** via Angular built-in i18n or @ngx-translate (to be decided per feature)
- Environment config via `environment.ts` pointing to backend API (`http://localhost:3000` dev, configurable prod)

### Backend Patterns (established)

- Global modules: `DatabaseModule`, `StorageModule` — no need to import in feature modules
- `ResponseUtils` for consistent JSON responses
- DTOs with `class-validator` + `class-transformer`
- Swagger decorators on all controllers
- SuperTokens middleware + `AuthGuard` + `@Roles()` decorator

## Migration & Modernization Workflow

For each frontend module being migrated:

1. **Analyze** the original Angular 8 module in `../tameribig-webapp-angular/`
2. **Identify** the corresponding backend endpoints in `apps/backend/`
3. **Design** the new Angular 19 component structure (standalone, signals)
4. **Implement** with Tailwind CSS + Angular CDK
5. **Connect** to the backend API via Angular HttpClient + SuperTokens auth
6. **Test** component + integration tests
7. **Update** CLAUDE.md migration status

## Governance

This constitution is the authoritative source for architectural decisions and non-negotiable constraints in the Tameri Project. All code contributions and reviews MUST verify compliance with these principles.

**Amendment procedure**: Any change to this constitution MUST be documented with a rationale, reviewed, and reflected in the version number below. Amendments that remove or redefine principles require a MAJOR version bump. New principles or material expansions require a MINOR bump. Clarifications and typo fixes require a PATCH bump.

**Compliance review**: Feature specifications (`/speckit.specify`) and implementation plans (`/speckit.plan`) MUST include a Constitution Check gate referencing the principles above.

**Runtime guidance**: Refer to `CLAUDE.md` for day-to-day development instructions, commands, and project structure details.

**Version**: 2.0.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-24
