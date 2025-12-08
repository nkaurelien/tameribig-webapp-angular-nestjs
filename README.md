# Tameri Project

API backend built with NestJS 11, CouchDB, Zitadel (OIDC), and MinIO (S3).

## Tech Stack

| Component      | Technology            |
| -------------- | --------------------- |
| Framework      | NestJS 11.1           |
| Language       | TypeScript 5.9        |
| Database       | CouchDB 3             |
| Authentication | Zitadel (OIDC)        |
| Object Storage | MinIO (S3 compatible) |
| Cache          | Redis 7               |
| Runtime        | Node.js 20+           |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (or npm)
- Docker & Docker Compose

### Setup

```bash
# Clone and install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start infrastructure (CouchDB, Zitadel, MinIO, Redis)
docker compose up -d

# Start development server
pnpm run start:dev
```

### Access Services

| Service            | URL                                 | Credentials                                  |
| ------------------ | ----------------------------------- | -------------------------------------------- |
| API                | http://localhost:3000               | -                                            |
| Swagger            | http://localhost:3000/api           | -                                            |
| Zitadel Console v2 | http://localhost:8080/ui/console    | zitadel-admin@zitadel.localhost / (see logs) |
| Zitadel Login v2   | http://localhost:3001/ui/v2/login   | -                                            |
| Zitadel Health     | http://localhost:8080/debug/healthz | -                                            |
| CouchDB Fauxton    | http://localhost:5984/\_utils       | admin / admin                                |
| MinIO Console      | http://localhost:9001               | minioadmin / minioadmin                      |

> **Note**: Zitadel generates the admin password at first startup. Check logs with:
>
> ```bash
> docker compose logs zitadel | grep -i password
> ```

## Development

```bash
# Development with hot reload
pnpm run start:dev

# Debug mode
pnpm run start:debug

# Run tests
pnpm run test

# Run e2e tests
pnpm run test:e2e

# Lint
pnpm run lint
```

## Docker

### Services Overview

| Service           | Container            | Port(s)    | Description                  |
| ----------------- | -------------------- | ---------- | ---------------------------- |
| **app**           | tameri-app           | 3000, 9229 | NestJS API (debug on 9229)   |
| **zitadel**       | tameri-zitadel       | 8080       | Authentication server (OIDC) |
| **zitadel-login** | tameri-zitadel-login | 3001       | Login v2 UI                  |
| **zitadel-db**    | tameri-zitadel-db    | -          | PostgreSQL for Zitadel       |
| **couchdb**       | tameri-couchdb       | 5984       | Document database            |
| **minio**         | tameri-minio         | 9000, 9001 | S3-compatible storage        |
| **redis**         | tameri-redis         | 6379       | Cache                        |

### Development

```bash
# Start all services with app
docker compose up -d

# Start only infrastructure (without app)
docker compose up -d couchdb redis minio zitadel zitadel-login

# Rebuild app after changes
docker compose up -d --build app

# View logs
docker compose logs -f app

# View Zitadel logs (to get admin password)
docker compose logs zitadel | grep -i password

# Stop all services
docker compose down

# Stop and remove volumes (clean reset)
docker compose down -v
```

### Production

```bash
# Build and start production stack
docker compose -f docker-compose.prod.yml up -d

# Stop
docker compose -f docker-compose.prod.yml down
```

### Zitadel Configuration

Zitadel uses **Login v2** with a separate login container. Key environment variables:

| Variable                 | Default                          | Description               |
| ------------------------ | -------------------------------- | ------------------------- |
| `ZITADEL_MASTERKEY`      | MasterkeyNeedsToHave32Characters | Encryption key (32 chars) |
| `ZITADEL_EXTERNALDOMAIN` | localhost                        | External domain           |
| `ZITADEL_EXTERNALSECURE` | false                            | Use HTTPS                 |
| `ZITADEL_DB_NAME`        | zitadel                          | PostgreSQL database       |
| `ZITADEL_DB_USER`        | zitadel                          | PostgreSQL user           |
| `ZITADEL_DB_PASSWORD`    | zitadel                          | PostgreSQL password       |

First-time setup creates an admin user. Check logs for the generated password.

## Project Structure

```
src/
├── @core/              # Core module (shared utilities)
│   ├── config/         # Configuration service
│   ├── constants/      # Enums and constants
│   ├── decorators/     # Custom decorators
│   ├── exceptions/     # Custom exceptions
│   ├── filters/        # Exception filters
│   ├── guards/         # Auth guards
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # HTTP middlewares
│   ├── services/       # Utility services
│   └── utils/          # Helper functions
├── @api/               # Feature modules
│   ├── auth/           # Authentication
│   ├── users/          # User management
│   └── ...
├── app.module.ts       # Root module
└── main.ts             # Entry point
```

## Environment Variables

See [.env.example](.env.example) for all available configuration options.

Key variables:

| Variable         | Description         | Default                           |
| ---------------- | ------------------- | --------------------------------- |
| `PORT`           | API port            | 3000                              |
| `NODE_ENV`       | Environment         | development                       |
| `COUCHDB_URL`    | CouchDB connection  | http://admin:admin@localhost:5984 |
| `ZITADEL_ISSUER` | Zitadel OIDC issuer | http://localhost:8080             |
| `MINIO_ENDPOINT` | MinIO S3 endpoint   | http://localhost:9000             |
| `REDIS_URL`      | Redis connection    | redis://localhost:6379            |

## License

MIT
