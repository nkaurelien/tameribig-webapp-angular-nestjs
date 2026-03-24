# API Reference

## Swagger/OpenAPI

La documentation interactive de l'API est disponible à :

- **Swagger UI** : http://localhost:3000/docs
- **OpenAPI JSON** : http://localhost:3000/openapi.json

## Préfixe global

Tous les endpoints (sauf auth) sont préfixés par `/api` :

```
GET  /api/users
POST /api/media
GET  /api/topics
```

Les endpoints SuperTokens sont sous `/auth/*` (pas de préfixe).

## Endpoints

### Users

| Méthode | Endpoint         | Auth | Description              |
| ------- | ---------------- | ---- | ------------------------ |
| GET     | `/api/users`     | Oui  | Liste des utilisateurs   |
| GET     | `/api/users/:id` | Oui  | Détail d'un utilisateur  |
| POST    | `/api/users`     | Oui  | Créer un utilisateur     |
| PUT     | `/api/users/:id` | Oui  | Modifier un utilisateur  |
| DELETE  | `/api/users/:id` | Oui  | Supprimer un utilisateur |

### Topics

| Méthode | Endpoint          | Auth | Description             |
| ------- | ----------------- | ---- | ----------------------- |
| GET     | `/api/topics`     | Non  | Liste des catégories    |
| GET     | `/api/topics/:id` | Non  | Détail d'une catégorie  |
| POST    | `/api/topics`     | Oui  | Créer une catégorie     |
| PUT     | `/api/topics/:id` | Oui  | Modifier une catégorie  |
| DELETE  | `/api/topics/:id` | Oui  | Supprimer une catégorie |

### Media

| Méthode | Endpoint         | Auth | Description                            |
| ------- | ---------------- | ---- | -------------------------------------- |
| GET     | `/api/media`     | Non  | Liste des médias publics               |
| GET     | `/api/media/:id` | Non  | Détail d'un média                      |
| POST    | `/api/media`     | Oui  | Upload (multipart/form-data, max 50MB) |
| PUT     | `/api/media/:id` | Oui  | Modifier les métadonnées               |
| DELETE  | `/api/media/:id` | Oui  | Supprimer un média                     |

### Search

| Méthode | Endpoint                              | Auth | Description              |
| ------- | ------------------------------------- | ---- | ------------------------ |
| GET     | `/api/search/suggestions?q=&limit=10` | Non  | Suggestions de recherche |
| GET     | `/api/search/popular?limit=10`        | Non  | Recherches populaires    |

### Notifications

| Méthode | Endpoint             | Auth | Description             |
| ------- | -------------------- | ---- | ----------------------- |
| GET     | `/api/notifications` | Oui  | Liste des notifications |
| POST    | `/api/notifications` | Oui  | Créer une notification  |

## Validation

Toutes les requêtes passent par un `ValidationPipe` global :

- **whitelist** : Seules les propriétés déclarées dans le DTO sont acceptées
- **transform** : Conversion automatique des types
- **forbidNonWhitelisted** : Rejet si propriétés inconnues

## Format des réponses

Les réponses utilisent `ResponseUtils` pour un format JSON cohérent.
