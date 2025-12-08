# CLAUDE.md - Project Context for AI Assistants

## Project Overview

**Tameri Project** is a NestJS 11 backend API migrated from an older NestJS 7 project (tameribig-server).

## Tech Stack

| Component | Technology     | Notes                                      |
| --------- | -------------- | ------------------------------------------ |
| Framework | NestJS 11.1    | Migrated from NestJS 7.6                   |
| Language  | TypeScript 5.9 | Strict mode                                |
| Database  | CouchDB 3      | Migrated from MongoDB + Firebase           |
| Auth      | Zitadel (OIDC) | Migrated from Firebase Auth                |
| Storage   | MinIO (S3)     | Replaces Firebase Storage, GCS, Cloudinary |
| Cache     | Redis 7        | Session & cache                            |
| Runtime   | Node.js 20+    |                                            |

## Project Structure

```
src/
├── @core/              # Shared infrastructure (migrated from tameribig-server)
│   ├── config/         # Environment configuration
│   ├── constants/      # Enums (order, role-type)
│   ├── decorators/     # @Lang, @Roles, @Trim, @ToInt, @IsPassword
│   ├── exceptions/     # Custom exceptions
│   ├── filters/        # Exception filters
│   ├── guards/         # Auth & role guards (Zitadel OIDC)
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # HTTP middlewares
│   ├── services/       # Generator, Password, Context services
│   └── utils/          # Response utilities, helpers
├── @api/               # Feature modules (to be migrated)
│   ├── auth/           # Authentication (Zitadel integration)
│   ├── users/          # User management
│   ├── topics/         # Topics CRUD
│   ├── media-images/   # Image upload & management
│   ├── notifications/  # Push notifications
│   └── search/         # Full-text search
├── app.module.ts
└── main.ts
```

## Key Patterns

### From Original Project (tameribig-server)

1. **Response Format**: Use `ResponseUtils` for consistent JSON responses
2. **Validation**: DTOs with class-validator decorators
3. **Guards**: `@UseGuards(AuthGuard)` + `@Roles('admin')`
4. **Decorators**: `@AuthUser()` to get current user from request

### New Patterns

1. **Database**: CouchDB with nano client (not Mongoose)
2. **Auth**: Zitadel OIDC tokens (not Firebase)
3. **Storage**: MinIO S3-compatible API (not Firebase Storage)

## Commands

```bash
# Development
pnpm run start:dev

# Docker (all services)
docker compose up -d

# Production
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

Key variables in `.env`:

- `PORT` - API port (default: 3000)
- `COUCHDB_URL` - CouchDB connection string
- `ZITADEL_ISSUER` - Zitadel OIDC issuer URL
- `MINIO_ENDPOINT` - MinIO S3 endpoint
- `REDIS_URL` - Redis connection

## Migration Status

### Completed

- Docker infrastructure (Zitadel, CouchDB, MinIO, Redis)
- Dockerfile (multi-stage)
- Environment configuration

### In Progress

- @core module migration

### Pending

- @api modules (Auth, Users, Topics, MediaImages, Notifications, Search)
- Zitadel OIDC integration
- CouchDB models

## Notes for AI

- This is a migration project - refer to `tameribig-server` for original implementation
- Use modern NestJS 11 patterns, not NestJS 7 patterns
- CouchDB is document-based like MongoDB but with different API
- Zitadel uses standard OIDC, not custom Firebase tokens
- MinIO is S3-compatible - use AWS SDK v3
