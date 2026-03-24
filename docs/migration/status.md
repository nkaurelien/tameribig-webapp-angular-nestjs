# État d'avancement de la migration

## Backend

### Terminé ✅

- [x] Structure monorepo (pnpm workspaces)
- [x] Infrastructure Docker (7 services avec health checks)
- [x] Module `@core` (config, guards, decorators, filters, services, utils)
- [x] Module `database` (CouchDB CRUD, indexing)
- [x] Module `storage` (MinIO S3 + imgproxy)
- [x] Module `auth` (SuperTokens: EmailPassword, Session, Roles)
- [x] Module `users` (CRUD complet, profils, indexes)
- [x] Module `topics` (CRUD complet)
- [x] Module `media` (CRUD + MinIO file management)
- [x] Swagger/OpenAPI
- [x] Validation globale, sécurité (Helmet, CORS)
- [x] Makefile, scripts, .env.example
- [x] Tests unitaires et e2e

### Partiel ⚠️

- [ ] `notifications` — Module existe mais push delivery (OneSignal) non intégré
- [ ] `search` — Module existe mais recherche full-text CouchDB non implémentée

### Non commencé ❌

- [ ] Service email (Nodemailer + templates)
- [ ] Zitadel OIDC (objectif final pour l'auth)
- [ ] Service scheduler (tâches cron)
- [ ] Push notifications (OneSignal)

## Frontend

### Terminé ✅

- [x] Scaffolding Angular 19 dans `apps/frontend/`
- [x] Configuration Tailwind CSS 4 + PrimeNG 21 (Aura) + tailwindcss-primeui
- [x] SuperTokens web-js (init, interceptor, guard, store)
- [x] NgRx Signal Store (auth state)
- [x] ApiService (HttpClient wrapper)
- [x] Modèles partagés (User, Media, Topic)
- [x] Layouts (MainLayout, AuthLayout)
- [x] Navigation responsive + Footer
- [x] Auth — Login (PrimeNG InputText + Password + Button)
- [x] Auth — Register (avec confirmation mot de passe)
- [x] Auth — Forgot password
- [x] Auth — Logout
- [x] Home (hero, catégories, médias récents, skeleton loading)
- [x] Page 404
- [x] Proxy dev (/api, /auth → backend:3000)
- [x] Build production fonctionnel

### Non commencé ❌ (par priorité)

| Priorité | Module    | Description                              |
| -------- | --------- | ---------------------------------------- |
| P2       | Explorer  | Grille d'images, vidéos, audio (masonry) |
| P2       | Search    | Recherche globale + suggestions          |
| P3       | Topics    | Navigation par catégories                |
| P3       | Console   | Dashboard utilisateur                    |
| P4       | Corporate | About, FAQ, Contact, Services, Privacy   |
| P4       | Network   | Réseau social / utilisateurs             |
| P4       | Help      | Page d'aide                              |

## Documentation

- [x] CLAUDE.md (contexte pour AI assistants)
- [x] Constitution speckit (`.specify/memory/constitution.md`)
- [x] Rapport d'analyse migration
- [x] Docsify (site de documentation)
