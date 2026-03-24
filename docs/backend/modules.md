# Modules Backend

## Vue d'ensemble

Le backend NestJS est organisé en modules fonctionnels. Deux modules sont **globaux** (`@Global()`) et n'ont pas besoin d'être importés dans les feature modules.

```
apps/backend/src/
├── @core/          # Module partagé (config, guards, decorators, services)
├── auth/           # SuperTokens (EmailPassword, Session, Roles)
├── database/       # CouchDB connection (@Global)
├── storage/        # MinIO S3 + imgproxy (@Global)
├── users/          # Gestion des profils
├── topics/         # Catégories/sujets
├── media/          # Upload et gestion des médias
├── notifications/  # Notifications (partiel)
├── search/         # Recherche et suggestions (partiel)
├── app.module.ts   # Module racine
└── main.ts         # Bootstrap
```

## @core

Module partagé contenant l'infrastructure transverse :

- **Config** : `AppConfigService` (variables d'environnement)
- **Services** : `PasswordService`, `GeneratorService`, `ContextService`
- **Decorators** : `@Roles()`, `@Lang()`, `@Trim()`, `@ToInt()`, `@IsPassword()`
- **Guards** : `AuthGuard` (SuperTokens)
- **Filters** : `BadRequestFilter`
- **Utils** : `ResponseUtils` (réponses JSON standardisées)

## database (Global)

Module global fournissant `CouchDbService` :

```typescript
// Disponible partout sans import
couchDbService.getOrCreateDatabase<T>("users");
couchDbService.getDatabase<T>("media");
couchDbService.createIndex("topics", { fields: ["slug"] });
```

## storage (Global)

Module global fournissant `StorageService` :

```typescript
// Upload via AWS SDK v3 (S3-compatible MinIO)
storageService.upload(file, key);
storageService.getSignedUrl(key);
storageService.delete(key);
```

## Feature modules

| Module        | Endpoints                         | Base de données              | Statut     |
| ------------- | --------------------------------- | ---------------------------- | ---------- |
| users         | `GET/POST/PUT/DELETE /api/users`  | CouchDB `users`              | ✅ Complet |
| topics        | `GET/POST/PUT/DELETE /api/topics` | CouchDB `topics`             | ✅ Complet |
| media         | `GET/POST/PUT/DELETE /api/media`  | CouchDB `media` + MinIO      | ✅ Complet |
| notifications | `GET/POST /api/notifications`     | CouchDB `notifications`      | ⚠️ Partiel |
| search        | `GET /api/search/suggestions`     | CouchDB `search_suggestions` | ⚠️ Partiel |
