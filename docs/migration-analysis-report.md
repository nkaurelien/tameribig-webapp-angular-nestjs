# Migration Analysis Report

**Date**: 2026-03-24
**Author**: Claude AI (assisted analysis)
**Scope**: Migration status of tameri-project monorepo and frontend integration strategy

## 1. Executive Summary

The `tameri-project` monorepo has successfully migrated its backend from `tameribig-server` (NestJS 7 + MongoDB + Firebase) to a modern stack (NestJS 11 + CouchDB + SuperTokens + MinIO). The frontend has not yet been started. This report analyzes the two source frontend projects to determine what should be integrated into the monorepo and how.

**Recommendation**: Create a new Angular 19+ frontend in `apps/frontend`, using the original `tameribig-webapp-angular` as a functional specification only. Do NOT copy or upgrade the Angular 8 code.

## 2. Projects Analyzed

### 2.1 tameri-project (monorepo — current)

- **Type**: pnpm monorepo
- **Backend**: NestJS 11.1, fully migrated and functional
- **Frontend**: Placeholder only (`apps/frontend/` with empty scripts)
- **Infrastructure**: Docker Compose with 7 services (app, PostgreSQL, SuperTokens, CouchDB, MinIO, imgproxy, Redis)
- **Backend modules**: auth, database, users, topics, media, notifications (partial), search (partial), storage

### 2.2 tameribig-webapp-angular (Angular 8 frontend)

- **Type**: Standalone Angular 8.2.14 application
- **Size**: 114 components, 57 modules
- **State management**: Akita + NgRx 7 + RxJS services (3 systems mixed)
- **UI framework**: MDB UIKit Pro Standard + Angular Material 8 + ng-bootstrap + jQuery
- **Auth**: Firebase Auth + custom backend auth
- **Storage**: Cloudinary + Firebase Storage
- **Deployment**: Firebase Hosting (Google Cloud)
- **Package manager**: yarn
- **Build**: Webpack (Angular CLI 8)

### 2.3 tameribig-webapp-angular-nestjs (NestJS 11 backend)

- **Type**: Standalone NestJS 11 backend (NOT a monorepo)
- **Status**: This is the direct source that was migrated into `tameri-project/apps/backend/`
- **Relevance**: Already fully integrated — no further action needed

## 3. Comparative Analysis

| Aspect      | tameri-project (monorepo) | tameribig-webapp-angular   | tameribig-webapp-angular-nestjs |
| ----------- | ------------------------- | -------------------------- | ------------------------------- |
| Type        | Monorepo (pnpm)           | Frontend only              | Backend only                    |
| Backend     | NestJS 11 ✅              | None                       | NestJS 11 (source of migration) |
| Frontend    | Placeholder ❌            | Angular 8 (114 components) | None                            |
| Auth        | SuperTokens               | Firebase Auth              | SuperTokens                     |
| Database    | CouchDB                   | Firebase Firestore         | CouchDB                         |
| Storage     | MinIO S3                  | Cloudinary + Firebase      | MinIO S3                        |
| State mgmt  | N/A                       | Akita + NgRx + Services    | N/A                             |
| UI/CSS      | N/A                       | MDB UIKit Pro + Material   | N/A                             |
| Package mgr | pnpm                      | yarn                       | pnpm                            |
| Node.js     | 20+                       | Not specified              | 20+                             |
| TypeScript  | 5.9 (strict)              | 3.5                        | 5.9 (strict)                    |
| Tests       | Jest 30 + Supertest       | Karma + Jasmine            | Jest 30 + Supertest             |

## 4. Technology Modernization Map

| Domain      | Old (tameribig-webapp-angular)    | New (tameri-project frontend)        | Rationale                                               |
| ----------- | --------------------------------- | ------------------------------------ | ------------------------------------------------------- |
| Framework   | Angular 8.2 (EOL 2020)            | Angular 19+                          | 6 major versions behind, standalone components, signals |
| Components  | NgModules + declarations          | Standalone components                | Modern Angular pattern, better tree-shaking             |
| State       | Akita + NgRx 7 + RxJS (3 systems) | Angular Signals + NgRx Signal Store  | Single unified approach, less boilerplate               |
| CSS/UI      | MDB UIKit Pro + Material + jQuery | Tailwind CSS 4 + Angular CDK         | No license dependency, utility-first, better DX         |
| Auth        | Firebase Auth + @angular/fire     | SuperTokens (HttpClient interceptor) | Matches backend auth system                             |
| Storage     | Cloudinary + Firebase Storage     | MinIO via backend API                | Matches backend storage                                 |
| Build       | Webpack (Angular CLI 8)           | esbuild (Angular CLI 19)             | 10x faster builds                                       |
| Linting     | TSLint (deprecated)               | ESLint 9 (flat config)               | TSLint is unmaintained                                  |
| Tests       | Karma + Jasmine                   | Jest or Vitest                       | Consistent with backend tooling                         |
| i18n        | @ngx-translate 11                 | @ngx-translate or Angular built-in   | Updated version                                         |
| Package mgr | yarn                              | pnpm                                 | Consistent with monorepo                                |

## 5. Frontend Modules Analysis

### 5.1 Modules from tameribig-webapp-angular to Reimplement

| Priority | Module    | Components | Description                                            | Backend Ready    |
| -------- | --------- | ---------- | ------------------------------------------------------ | ---------------- |
| **P1**   | Auth      | 4          | Login, register, forgot-password, logout               | ✅ SuperTokens   |
| **P1**   | Home      | 2          | Landing page with featured content                     | ✅ topics, media |
| **P2**   | Explorer  | 8+         | Browse images, videos, audio, creations (masonry grid) | ✅ media         |
| **P2**   | Search    | 3          | Global search with suggestions and filtering           | ⚠️ partial       |
| **P3**   | Topics    | 3          | Category browsing and filtering                        | ✅ topics        |
| **P3**   | Console   | 4+         | User dashboard, profile management, my uploads         | ✅ users, media  |
| **P4**   | Corporate | 6          | About, FAQ, contact, services, recruitment, privacy    | N/A (static)     |
| **P4**   | Network   | 2          | User network/social features                           | ✅ users         |
| **P4**   | Help      | 1          | Help/documentation page                                | N/A (static)     |
| **P4**   | Errors    | 1          | 404 page                                               | N/A (static)     |

### 5.2 Shared/Core Services to Reimplement

| Service              | Original                      | New Approach                                 |
| -------------------- | ----------------------------- | -------------------------------------------- |
| AuthService          | Firebase Auth flow            | SuperTokens session + HttpClient interceptor |
| TokenInterceptor     | JWT in Authorization header   | SuperTokens auto-session management          |
| ImagesApiService     | REST calls to Cloud Functions | HttpClient to `/api/media`                   |
| CategoriesApiService | REST calls to Cloud Functions | HttpClient to `/api/topics`                  |
| SearchApiService     | REST calls to Cloud Functions | HttpClient to `/api/search/suggestions`      |
| SeoService           | Meta tags management          | Angular Meta + Title services                |
| ErrorHandler         | Custom global handler         | Angular ErrorHandler + Pino logging          |

### 5.3 What NOT to Migrate

| Item                    | Reason                                    |
| ----------------------- | ----------------------------------------- |
| Firebase configuration  | Replaced by SuperTokens + MinIO           |
| Cloudinary integration  | Replaced by MinIO + imgproxy              |
| MDB UIKit Pro           | Proprietary license, replaced by Tailwind |
| Akita stores            | Replaced by Angular Signals               |
| NgRx 7 router store     | Angular 19 has better router integration  |
| jQuery dependencies     | Not needed with modern Angular            |
| Legacy auth2 module     | Deprecated in original project            |
| Google Maps integration | Not in current scope                      |
| reCAPTCHA               | Can be added later if needed              |
| Analytics/GTM           | Can be added later if needed              |

## 6. Architectural Recommendations

### 6.1 Monorepo Structure (proposed)

```text
tameri-project/
├── apps/
│   ├── backend/          # @tameri/backend — NestJS 11 API (done)
│   └── frontend/         # @tameri/frontend — Angular 19+ SPA (to create)
│       ├── src/
│       │   ├── app/
│       │   │   ├── auth/          # Login, register, forgot-password
│       │   │   ├── home/          # Landing page
│       │   │   ├── explorer/      # Media browsing
│       │   │   ├── search/        # Search + suggestions
│       │   │   ├── topics/        # Category browsing
│       │   │   ├── console/       # User dashboard
│       │   │   ├── corporate/     # Static pages
│       │   │   ├── shared/        # Shared components, pipes, directives
│       │   │   └── core/          # Auth service, interceptors, guards
│       │   ├── environments/
│       │   └── styles.css         # Tailwind entry point
│       ├── tailwind.config.js
│       ├── angular.json
│       └── package.json
├── libs/                 # (future) Shared types between frontend and backend
├── docker-compose.yml
└── pnpm-workspace.yaml
```

### 6.2 Routing Structure (proposed)

```text
/                    → redirect to /home
/auth/login          → LoginComponent
/auth/register       → RegisterComponent
/auth/forgot-password → ForgotPasswordComponent
/home                → HomeComponent
/explorer            → ExplorerComponent (images, videos, audio tabs)
/search              → SearchComponent
/topics              → TopicsComponent
/topics/:id          → TopicDetailComponent
/console             → ConsoleComponent (auth required)
/about               → AboutComponent
/faq                 → FaqComponent
/contact             → ContactComponent
/privacy             → PrivacyComponent
/**                  → NotFoundComponent
```

### 6.3 Key Technical Decisions

1. **Standalone components only** — No NgModules. Use `provideRouter()`, `provideHttpClient()`, etc.
2. **Lazy loading** — Each route module lazy-loaded via `loadComponent`
3. **Signals for state** — `signal()`, `computed()`, `effect()` for local state. NgRx Signal Store for shared state (auth, user profile)
4. **HttpClient with interceptors** — SuperTokens session interceptor for auth. Base URL interceptor for API prefix
5. **Tailwind CSS 4** — Utility-first styling. No component library dependency
6. **Angular CDK** — For overlays, virtual scrolling (image gallery), drag-drop

## 7. Effort Estimation

| Module                                         | Estimated Effort | Dependencies                          |
| ---------------------------------------------- | ---------------- | ------------------------------------- |
| Project setup (Angular 19 + Tailwind + config) | Small            | None                                  |
| Auth (login, register, forgot-password)        | Medium           | SuperTokens integration               |
| Home / Landing                                 | Small            | topics + media API                    |
| Explorer (images grid)                         | Medium-Large     | media API + imgproxy URLs             |
| Search                                         | Medium           | search API (needs backend completion) |
| Topics                                         | Small            | topics API                            |
| Console (dashboard)                            | Medium           | users + media API                     |
| Corporate pages                                | Small            | None (static)                         |
| Shared (interceptors, guards, services)        | Medium           | SuperTokens, HttpClient               |

**Total estimated scope**: Medium-Large project. Recommended approach: implement P1 modules first (auth + home) as MVP, then iterate.

## 8. Risks and Mitigations

| Risk                                 | Impact                                      | Mitigation                                                                            |
| ------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| Search backend not complete          | P2 module blocked                           | Complete search module in backend first                                               |
| Notifications backend partial        | Push notifications unavailable              | Defer to later phase                                                                  |
| SuperTokens frontend SDK integration | Auth flow complexity                        | Use supertokens-web-js, follow official Angular guide                                 |
| imgproxy URL generation for frontend | Image display depends on correct URL format | Backend already has URL generation — expose via API or share logic                    |
| MDB UIKit Pro design loss            | UI/UX regression                            | Design new UI with Tailwind, prioritize functionality over pixel-perfect reproduction |

## 9. Conclusion

The `tameribig-webapp-angular-nestjs` project has been **fully migrated** into the monorepo backend. No further action needed.

The `tameribig-webapp-angular` project provides the **functional blueprint** for the frontend. A clean rewrite in Angular 19+ with modern tooling is strongly recommended over attempting to upgrade the Angular 8 codebase (which would require migrating through 11 major versions and replacing 3 state management systems, Firebase auth, Cloudinary, and a proprietary UI library).

Next steps:

1. Run `/speckit.specify` to create the frontend feature specification
2. Run `/speckit.plan` to create the implementation plan
3. Start with P1 modules: auth + home
