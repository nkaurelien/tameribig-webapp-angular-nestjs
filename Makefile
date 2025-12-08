# Tameri Project - Makefile
# ==========================
# Usage: make <target>

.PHONY: help install dev build start test lint format docker-up docker-down docker-logs docker-clean db-setup

# Default target
help:
	@echo "Tameri Project - Available Commands"
	@echo "===================================="
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make build        - Build the project"
	@echo "  make start        - Start production server"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run ESLint"
	@echo "  make format       - Format code with Prettier"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up    - Start all Docker services"
	@echo "  make docker-down  - Stop all Docker services"
	@echo "  make docker-logs  - Show Docker logs (follow)"
	@echo "  make docker-clean - Stop and remove volumes"
	@echo "  make docker-build - Rebuild Docker images"
	@echo ""
	@echo "Database:"
	@echo "  make db-setup     - Initialize CouchDB databases"
	@echo "  make db-backup    - Backup CouchDB data"
	@echo ""
	@echo "Services:"
	@echo "  make services     - Show service URLs"

# ===================
# Development
# ===================

install:
	pnpm install

dev:
	pnpm run start:dev

build:
	pnpm run build

start:
	pnpm run start:prod

test:
	pnpm run test

test-watch:
	pnpm run test:watch

test-cov:
	pnpm run test:cov

test-e2e:
	pnpm run test:e2e

lint:
	pnpm run lint

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
	@echo "  Swagger Docs:     http://localhost:3000/api"
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
	rm -rf dist node_modules .pnpm-store

clean-all: docker-clean clean
	@echo "Full cleanup complete"
