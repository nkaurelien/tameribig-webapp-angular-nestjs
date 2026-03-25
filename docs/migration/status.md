# État d'avancement de la migration

## Backend

### Terminé ✅

- [x] Structure monorepo (pnpm workspaces)
- [x] Infrastructure Docker (7 services avec health checks)
- [x] Module `@core` (config, guards, decorators, filters, services, utils)
- [x] Module `database` (CouchDB CRUD, indexing)
- [x] Module `storage` (MinIO S3 + imgproxy)
- [x] Module `auth` (SuperTokens: EmailPassword, Session, Roles, email link override)
- [x] Module `users` (CRUD complet, profils, indexes)
- [x] Module `topics` (CRUD complet)
- [x] Module `media` (CRUD + MinIO file management, author displayName from users)
- [x] Swagger/OpenAPI
- [x] Validation globale, sécurité (Helmet, CORS)
- [x] Makefile, scripts, .env.example
- [x] Tests unitaires et e2e
- [x] CI/CD GitLab (pipeline TDD + OCI image builds)
- [x] Seeder (demo users, topics, media, search data)

### Partiel ⚠️

- [ ] `notifications` — Module existe mais push delivery (OneSignal) non intégré
- [ ] `search` — Module existe mais recherche full-text CouchDB non implémentée
- [ ] `email` — Template HTML créé (`email-templates.ts`), besoin config SMTP

### Non commencé ❌

- [ ] Zitadel OIDC (objectif final pour l'auth)
- [ ] Service scheduler (tâches cron)
- [ ] Push notifications (OneSignal)

## Frontend

### Terminé ✅

- [x] Scaffolding Angular 19 dans `apps/frontend/`
- [x] **DaisyUI 5** + Tailwind CSS 4 (thème custom "tameri", indigo primary)
- [x] SuperTokens web-js (init, interceptor, guard, store)
- [x] NgRx Signal Store (auth + user state)
- [x] Services API (ApiService, MediaApiService, UserApiService)
- [x] `siteConfig` — constantes centralisées (nom, email, domaine, social, legal, media)
- [x] Modèles partagés (User, Media, Topic)
- [x] Layouts (MainLayout, AuthLayout — DaisyUI)
- [x] Navigation responsive (header sticky, liens à gauche, "Mes médias" pour users connectés)
- [x] Footer DaisyUI (5 colonnes, liens /info/\*)
- [x] MediaCard component (routerLink vers /media/:id, badges type + prix)
- [x] **Auth** — Login, Register, Forgot password, Reset password, Logout
- [x] **Home** — Barre de recherche, boutons media type, honeycomb hexagonal
- [x] **Explorer** — Grille de médias, filtres par type
- [x] **Media detail** — Preview, métadonnées, téléchargement, upvote, partage, mots-clés
- [x] **Search** — Barre de recherche, filtres, résultats
- [x] **Topics** — Honeycomb hexagonal + détail par topic
- [x] **Console** — Profil, liste médias (filtres statut), upload (drag-and-drop, progress), edit, settings
- [x] **Info pages** — About, Contact (formulaire), FAQ (accordion), Privacy, Terms (CGU)
- [x] Page 404
- [x] Scroll-to-top
- [x] Proxy dev (/api → backend:3000)
- [x] Build production fonctionnel

### Non commencé ❌

| Module  | Description                  |
| ------- | ---------------------------- |
| Network | Réseau social / utilisateurs |

## Documentation

- [x] CLAUDE.md (contexte pour AI assistants)
- [x] Docsify (site de documentation)
- [x] Rapport d'analyse migration
