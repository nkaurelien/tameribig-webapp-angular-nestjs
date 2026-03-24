# Tameri Project

Monorepo containing the Tameri API (NestJS backend) and web application (AngularJS frontend).

## Tech Stack

| Component       | Technology            |
| --------------- | --------------------- |
| Framework       | NestJS 11.1           |
| Language        | TypeScript 5.9        |
| Database        | CouchDB 3             |
| Authentication  | SuperTokens           |
| Object Storage  | MinIO (S3 compatible) |
| Image Process   | imgproxy              |
| Cache           | Redis 7               |
| Runtime         | Node.js 20+           |
| Package Manager | pnpm (workspaces)     |

## Project Structure

```
tameri-project/
├── apps/
│   ├── backend/              # @tameri/backend - NestJS API
│   │   ├── src/
│   │   │   ├── @core/        # Core module (shared utilities)
│   │   │   ├── auth/         # Authentication
│   │   │   ├── database/     # Database connections
│   │   │   ├── media/        # File uploads & imgproxy
│   │   │   ├── notifications/# Notifications management
│   │   │   ├── search/       # Search suggestions
│   │   │   ├── storage/      # MinIO S3 storage
│   │   │   ├── topics/       # Categories/topics
│   │   │   └── users/        # User management
│   │   ├── test/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   └── frontend/             # @tameri/frontend - AngularJS (coming soon)
│       └── package.json
├── docker/                   # Docker init scripts
├── package.json              # Root monorepo config
├── pnpm-workspace.yaml       # Workspaces definition
├── docker-compose.yml        # Development services
├── Makefile                  # Shortcuts
└── .env                      # Environment variables
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose

### Setup

```bash
# Clone and install all dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start infrastructure + setup databases
make setup

# Or step by step:
docker compose up -d
make db-setup
make minio-setup

# Start development server
make dev
```

## Development Commands

### Using Make (recommended)

| Command              | Description               |
| -------------------- | ------------------------- |
| `make install`       | Install all dependencies  |
| `make dev`           | Start backend dev server  |
| `make dev-frontend`  | Start frontend dev server |
| `make build`         | Build all packages        |
| `make build-backend` | Build backend only        |
| `make test`          | Run all tests             |
| `make test-backend`  | Run backend tests         |
| `make test-cov`      | Run tests with coverage   |
| `make lint`          | Lint all packages         |
| `make format`        | Format code with Prettier |

### Using pnpm directly

```bash
# Run command on specific package
pnpm --filter @tameri/backend <command>
pnpm --filter @tameri/frontend <command>

# Run command on all packages
pnpm -r <command>

# Examples
pnpm --filter @tameri/backend start:dev
pnpm --filter @tameri/backend test
pnpm --filter @tameri/backend lint
```

### Available Scripts

**Root level:**

- `pnpm run dev` - Start backend dev server
- `pnpm run build` - Build all packages
- `pnpm run test` - Run all tests
- `pnpm run lint` - Lint all packages

**Backend (@tameri/backend):**

- `start:dev` - Development with hot reload
- `start:debug` - Debug mode (port 9229)
- `start:prod` - Production mode
- `build` - Build for production
- `test` - Run unit tests
- `test:watch` - Run tests in watch mode
- `test:cov` - Run tests with coverage
- `test:e2e` - Run end-to-end tests
- `lint` - ESLint
- `format` - Prettier

## Docker

### Service URLs

| Service     | URL                           | Credentials             |
| ----------- | ----------------------------- | ----------------------- |
| API         | http://localhost:3000         | -                       |
| Swagger     | http://localhost:3000/api     | -                       |
| SuperTokens | http://localhost:3567         | -                       |
| CouchDB     | http://localhost:5984/\_utils | admin / admin           |
| MinIO       | http://localhost:9001         | minioadmin / minioadmin |
| imgproxy    | http://localhost:8080         | -                       |
| Redis       | localhost:6379                | -                       |
| PostgreSQL  | localhost:5432                | postgres / postgres     |

### Docker Commands

| Command             | Description             |
| ------------------- | ----------------------- |
| `make docker-up`    | Start all services      |
| `make docker-down`  | Stop all services       |
| `make docker-logs`  | Follow logs             |
| `make docker-clean` | Stop and remove volumes |
| `make docker-build` | Rebuild images          |
| `make docker-ps`    | Show running containers |

### Database Commands

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `make db-setup`    | Create CouchDB databases       |
| `make db-list`     | List all databases             |
| `make db-backup`   | Backup databases to ./backups/ |
| `make minio-setup` | Create MinIO bucket            |

## Environment Variables

See [.env.example](.env.example) for all options.

| Variable                     | Description        | Default                           |
| ---------------------------- | ------------------ | --------------------------------- |
| `PORT`                       | API port           | 3000                              |
| `NODE_ENV`                   | Environment        | development                       |
| `COUCHDB_URL`                | CouchDB connection | http://admin:admin@localhost:5984 |
| `MINIO_ENDPOINT`             | MinIO S3 endpoint  | http://localhost:9000             |
| `MINIO_BUCKET`               | MinIO bucket name  | tameri-bucket                     |
| `SUPERTOKENS_CONNECTION_URI` | SuperTokens URI    | http://localhost:3567             |
| `IMGPROXY_URL`               | imgproxy base URL  | http://localhost:8080             |
| `REDIS_URL`                  | Redis connection   | redis://localhost:6379            |

## Adding the Frontend

The frontend placeholder is ready at `apps/frontend/`. To add AngularJS:

```bash
cd apps/frontend

# Initialize AngularJS project
# ... your setup commands

# Update package.json with actual scripts
```

The root `package.json` already has commands configured:

- `pnpm run dev:frontend`
- `pnpm run build:frontend`
- `pnpm run lint:frontend`
- `pnpm run test:frontend`

## License

MIT
