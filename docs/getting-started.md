# Démarrage rapide

## Prérequis

- **Node.js** 20+
- **pnpm** (installé via `corepack enable`)
- **Docker** et **Docker Compose**

## Installation

```bash
# Cloner le projet
git clone <repo-url> tameri-project
cd tameri-project

# Setup complet (install + docker + bases de données)
make setup
```

Ou étape par étape :

```bash
# 1. Installer les dépendances
make install

# 2. Démarrer les services Docker
make docker-up

# 3. Initialiser les bases de données
make db-setup

# 4. Configurer MinIO
make minio-setup
```

## Configuration

Copier le fichier d'environnement :

```bash
cp .env.example .env
```

Variables importantes :

| Variable         | Valeur par défaut                   | Description            |
| ---------------- | ----------------------------------- | ---------------------- |
| `PORT`           | `3000`                              | Port du backend        |
| `WEBSITE_DOMAIN` | `http://localhost:4200`             | URL du frontend (CORS) |
| `API_DOMAIN`     | `http://localhost:3000`             | URL du backend         |
| `COUCHDB_URL`    | `http://admin:admin@localhost:5984` | Connexion CouchDB      |
| `S3_ENDPOINT`    | `http://localhost:9000`             | Endpoint MinIO         |

## Développement

```bash
# Backend seul
make dev-backend

# Frontend seul
make dev-frontend

# Documentation
make docs
```

## Services

Après `make docker-up` :

| Service         | URL                           | Identifiants            |
| --------------- | ----------------------------- | ----------------------- |
| API NestJS      | http://localhost:3000         | —                       |
| Swagger         | http://localhost:3000/docs    | —                       |
| Frontend        | http://localhost:4200         | —                       |
| Documentation   | http://localhost:3333         | —                       |
| CouchDB Fauxton | http://localhost:5984/\_utils | admin / admin           |
| MinIO Console   | http://localhost:9001         | minioadmin / minioadmin |
| SuperTokens     | http://localhost:3567         | —                       |

## Commandes utiles

```bash
make help           # Liste toutes les commandes
make test           # Lancer les tests
make lint           # Lancer ESLint
make format         # Formater le code
make docker-logs    # Voir les logs Docker
make services       # Afficher les URLs des services
```
