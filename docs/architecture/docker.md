# Infrastructure Docker

## Services

Tous les services sont définis dans `docker-compose.yml` avec health checks.

```bash
# Démarrer
make docker-up

# Arrêter
make docker-down

# Voir les logs
make docker-logs

# Supprimer tout (volumes inclus)
make docker-clean
```

## Réseau

Tous les services sont sur le réseau `tameri-network` (bridge). Les services communiquent entre eux via leurs noms de service Docker.

## Schéma des services

```
tameri-network (bridge)
├── app (node:20)            → :3000, :9229
├── postgres (16-alpine)     → :5432
├── supertokens              → :3567  ← dépend de postgres
├── couchdb (3.4.2)          → :5984
├── minio                    → :9000, :9001
├── imgproxy                 → :8080  ← lit depuis minio
└── redis (7-alpine)         → :6379
```

## Volumes

| Service    | Volume          | Données              |
| ---------- | --------------- | -------------------- |
| CouchDB    | `couchdb_data`  | Documents de la base |
| PostgreSQL | `postgres_data` | Sessions SuperTokens |
| MinIO      | `minio_data`    | Fichiers uploadés    |
| Redis      | `redis_data`    | Cache                |

## Health checks

Chaque service inclut un health check :

- **PostgreSQL** : `pg_isready`
- **CouchDB** : `curl http://localhost:5984/`
- **SuperTokens** : `curl http://localhost:3567/hello`
- **MinIO** : `curl http://localhost:9000/minio/health/live`
- **Redis** : `redis-cli ping`

## Production

Le fichier `docker-compose.prod.yml` fournit une configuration de production :

- Pas de volumes de développement
- Variables d'environnement via `.env`
- Pas de ports de debug exposés
