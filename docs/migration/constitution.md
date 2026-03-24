# Constitution du projet

Ce document résume les principes de la [constitution complète](../../.specify/memory/constitution.md) (v2.0.0).

## Principes fondamentaux

### I. Monorepo-First

Tout le code vit dans `tameri-project` sous pnpm workspaces. Pas de repos séparés.

### II. Modern Stack Only

Chaque choix technologique doit utiliser la génération actuelle. Le code legacy ne doit **jamais** être copié tel quel.

| DOIT utiliser                       | NE DOIT PAS utiliser         |
| ----------------------------------- | ---------------------------- |
| Angular 19+ (standalone)            | Angular 8, AngularJS         |
| NestJS 11+                          | NestJS 7                     |
| CouchDB (nano)                      | MongoDB, Mongoose, Firebase  |
| SuperTokens → Zitadel               | Firebase Auth                |
| MinIO (AWS SDK v3)                  | Cloudinary, Firebase Storage |
| Tailwind CSS 4 + PrimeNG            | MDB UIKit Pro, jQuery        |
| Angular Signals / NgRx Signal Store | Akita, NgRx 7                |
| pnpm                                | npm, yarn                    |
| ESLint 9                            | TSLint                       |

### III. Document-Database-First

CouchDB est le data store principal. Pas d'ORM. Interfaces TypeScript pour les documents.

### IV. Strict TypeScript & Validation

Mode strict obligatoire. DTOs avec `class-validator`. ValidationPipe global.

### V. Infrastructure as Docker Services

Tous les services dans `docker-compose.yml` avec health checks. `make docker-up` avant `make dev`.

### VI. Incremental Migration

Module par module, pas de big-bang. Chaque module doit être fonctionnel et testé avant le suivant.

### VII. Test Discipline

Tests unitaires + e2e pour le backend, tests de composants + intégration pour le frontend.

### VIII. API-Contract Alignment

Frontend et backend partagent les mêmes contrats de données. Swagger/OpenAPI comme source de vérité.

## Projets source (référence fonctionnelle)

- `../tameribig-webapp-angular/` — Frontend Angular 8 (114 composants) → **Ne pas copier le code**
- `../tameribig-webapp-angular-nestjs/` — Backend NestJS 11 → **Déjà migré**
- `../tameribig-server/` — Backend NestJS 7 original → **Référence legacy**
