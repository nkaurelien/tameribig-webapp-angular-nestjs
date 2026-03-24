# Vue d'ensemble de l'architecture

## Monorepo pnpm

Le projet utilise **pnpm workspaces** pour gérer deux applications :

```
apps/
├── backend/    # @tameri/backend  — NestJS 11 API
└── frontend/   # @tameri/frontend — Angular 19 SPA
```

Configuration dans `pnpm-workspace.yaml` :

```yaml
packages:
  - "apps/*"
```

## Flux de données

```
┌─────────────┐     HTTP/REST      ┌──────────────┐
│  Angular 19 │ ◄──────────────── │   NestJS 11  │
│  Frontend   │    /api/*          │   Backend    │
│  :4200      │    /auth/*         │   :3000      │
└─────────────┘                    └──────┬───────┘
                                          │
                    ┌─────────────────────┼──────────────────┐
                    │                     │                  │
              ┌─────▼─────┐     ┌────────▼────┐    ┌───────▼──────┐
              │  CouchDB   │     │   MinIO     │    │ SuperTokens  │
              │  :5984     │     │   :9000     │    │  :3567       │
              │  Documents │     │   Fichiers  │    │  Auth        │
              └────────────┘     └─────────────┘    └──────┬───────┘
                                                           │
                                                    ┌──────▼───────┐
                                                    │  PostgreSQL  │
                                                    │  :5432       │
                                                    └──────────────┘
```

## Principes architecturaux

1. **Monorepo-First** — Tout le code dans un seul dépôt
2. **Modern Stack Only** — Pas de code legacy copié tel quel
3. **Document-Database-First** — CouchDB sans ORM
4. **Infrastructure as Code** — Tout dans Docker Compose
5. **Incremental Migration** — Module par module
6. **API-Contract Alignment** — Types partagés frontend/backend

Voir la [constitution complète](migration/constitution.md) pour les détails.

## Communication Frontend ↔ Backend

En développement, le frontend Angular utilise un **proxy** (`proxy.conf.json`) :

- `/api/*` → `http://localhost:3000`
- `/auth/*` → `http://localhost:3000`

Cela évite les problèmes de CORS et simplifie l'intégration SuperTokens.

En production, un reverse proxy (nginx) devra router les requêtes.
