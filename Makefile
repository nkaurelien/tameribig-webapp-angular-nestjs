# Tameri Project - Monorepo Makefile
# ==================================
# Usage: make <target>

.PHONY: help install dev build start test lint format docker-up docker-down docker-logs docker-clean db-setup docs

# Default target
help:
	@echo "Tameri Project - Monorepo Commands"
	@echo "==================================="
	@echo ""
	@echo "Development:"
	@echo "  make install          - Install all dependencies"
	@echo "  make dev              - Start backend development server"
	@echo "  make dev-frontend     - Start frontend development server"
	@echo "  make build            - Build all packages"
	@echo "  make build-backend    - Build backend only"
	@echo "  make build-frontend   - Build frontend only"
	@echo "  make start            - Start production servers"
	@echo "  make test             - Run all tests"
	@echo "  make test-backend     - Run backend tests"
	@echo "  make lint             - Run ESLint on all packages"
	@echo "  make format           - Format code with Prettier"
	@echo ""
	@echo "Documentation:"
	@echo "  make docs             - Start documentation server (Docsify)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up        - Start all Docker services"
	@echo "  make docker-down      - Stop all Docker services"
	@echo "  make docker-logs      - Show Docker logs (follow)"
	@echo "  make docker-clean     - Stop and remove volumes"
	@echo "  make docker-build     - Rebuild Docker images"
	@echo ""
	@echo "Database:"
	@echo "  make db-setup         - Initialize CouchDB databases"
	@echo "  make db-backup        - Backup CouchDB data"
	@echo ""
	@echo "Services:"
	@echo "  make services         - Show service URLs"

# ===================
# Development
# ===================

install:
	pnpm install

dev:
	pnpm run dev:backend

dev-backend:
	pnpm run dev:backend

dev-frontend:
	pnpm run dev:frontend

build:
	pnpm run build

build-backend:
	pnpm run build:backend

build-frontend:
	pnpm run build:frontend

start:
	pnpm run start

start-backend:
	pnpm run start:backend

start-frontend:
	pnpm run start:frontend

test:
	pnpm run test

test-backend:
	pnpm run test:backend

test-watch:
	pnpm --filter @tameri/backend run test:watch

test-cov:
	pnpm run test:cov

test-e2e:
	pnpm run test:e2e

lint:
	pnpm run lint

lint-backend:
	pnpm run lint:backend

lint-frontend:
	pnpm run lint:frontend

format:
	pnpm run format

# ===================
# Docker
# ===================

docker-up:
	docker compose up -d
	@echo ""
	@echo "Services started! Access:"
	@echo "  - API:           http://localhost:3000"
	@echo "  - Swagger:       http://localhost:3000/api"
	@echo "  - CouchDB:       http://localhost:5984/_utils"
	@echo "  - MinIO:         http://localhost:9001"
	@echo "  - SuperTokens:   http://localhost:3567"
	@echo "  - imgproxy:      http://localhost:8080"

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-logs-app:
	docker compose logs -f app

docker-clean:
	docker compose down -v --remove-orphans
	@echo "All containers and volumes removed"

docker-build:
	docker compose build --no-cache

docker-restart:
	docker compose restart

docker-ps:
	docker compose ps

# ===================
# Database
# ===================

db-setup:
	@echo "Setting up CouchDB databases..."
	@curl -X PUT http://admin:admin@localhost:5984/users 2>/dev/null || true
	@curl -X PUT http://admin:admin@localhost:5984/notifications 2>/dev/null || true
	@curl -X PUT http://admin:admin@localhost:5984/topics 2>/dev/null || true
	@curl -X PUT http://admin:admin@localhost:5984/search_suggestions 2>/dev/null || true
	@curl -X PUT http://admin:admin@localhost:5984/media 2>/dev/null || true
	@echo "Databases created!"

db-list:
	@curl -s http://admin:admin@localhost:5984/_all_dbs | jq

db-backup:
	@mkdir -p backups
	@echo "Backing up CouchDB..."
	@for db in users notifications topics search_suggestions media; do \
		curl -s "http://admin:admin@localhost:5984/$$db/_all_docs?include_docs=true" > backups/$$db-$$(date +%Y%m%d).json; \
	done
	@echo "Backup complete! Files in ./backups/"

# ===================
# MinIO
# ===================

minio-setup:
	@echo "Creating MinIO bucket..."
	@docker compose exec minio mc alias set local http://localhost:9000 minioadmin minioadmin 2>/dev/null || true
	@docker compose exec minio mc mb local/tameri-bucket 2>/dev/null || true
	@docker compose exec minio mc anonymous set download local/tameri-bucket 2>/dev/null || true
	@echo "MinIO bucket created!"

# ===================
# Services Info
# ===================

services:
	@echo ""
	@echo "Service URLs:"
	@echo "============="
	@echo "  API:              http://localhost:3000"
	@echo "  Swagger Docs:     http://localhost:3000/docs"
	@echo "  Frontend:         http://localhost:4200"
	@echo "  Documentation:    http://localhost:3333"
	@echo "  SuperTokens:      http://localhost:3567"
	@echo "  CouchDB Fauxton:  http://localhost:5984/_utils"
	@echo "  MinIO Console:    http://localhost:9001"
	@echo "  imgproxy:         http://localhost:8080"
	@echo "  Redis:            localhost:6379"
	@echo "  PostgreSQL:       localhost:5432"
	@echo ""
	@echo "Default Credentials:"
	@echo "===================="
	@echo "  CouchDB:    admin / admin"
	@echo "  MinIO:      minioadmin / minioadmin"
	@echo "  PostgreSQL: postgres / postgres"

# ===================
# Documentation
# ===================

docs:
	@echo "Starting Docsify documentation server..."
	@echo "  → http://localhost:3333"
	pnpm run docs

# ===================
# Quick Setup
# ===================

setup: install docker-up
	@echo ""
	@echo "Waiting for services to be ready..."
	@sleep 10
	@make db-setup
	@make minio-setup
	@echo ""
	@echo "Setup complete! Run 'make dev' to start development"

# ===================
# Cleanup
# ===================

clean:
	rm -rf apps/backend/dist apps/frontend/dist node_modules apps/*/node_modules .pnpm-store

clean-all: docker-clean clean
	@echo "Full cleanup complete"
