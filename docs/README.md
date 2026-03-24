# Tameri Project

> Monorepo pour la plateforme Tameri — partage de médias créatifs.

## Qu'est-ce que Tameri ?

Tameri est une plateforme web permettant d'explorer, partager et télécharger des médias créatifs (images, vidéos, audio). Le projet est organisé en monorepo avec un backend NestJS et un frontend Angular.

## Stack technique

| Composant       | Technologie                           |
| --------------- | ------------------------------------- |
| Backend         | NestJS 11 + TypeScript 5.9            |
| Frontend        | Angular 19 + PrimeNG + Tailwind CSS 4 |
| Base de données | CouchDB 3                             |
| Auth            | SuperTokens 24                        |
| Stockage        | MinIO (S3-compatible)                 |
| Images          | imgproxy                              |
| Cache           | Redis 7                               |
| Infra           | Docker Compose                        |

## Structure du monorepo

```
tameri-project/
├── apps/
│   ├── backend/      # @tameri/backend — API NestJS
│   └── frontend/     # @tameri/frontend — SPA Angular 19
├── docs/             # Documentation (Docsify)
├── docker/           # Scripts d'init DB
├── docker-compose.yml
├── Makefile
└── pnpm-workspace.yaml
```

## Liens rapides

- [Démarrage rapide](getting-started.md)
- [Architecture](architecture/overview.md)
- [API Reference](backend/api.md)
- [État de la migration](migration/status.md)
