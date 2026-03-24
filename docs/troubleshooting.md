# Troubleshooting

## Frontend

### Page blanche après `ng serve`

**Cause** : Tailwind CSS ne génère pas les classes utilitaires.

**Solution** : Vérifier que `.postcssrc.json` existe dans `apps/frontend/` :

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Le builder Angular esbuild ne lit PAS `postcss.config.js` — il faut `.postcssrc.json`.

### Page noire / dark mode non voulu

**Cause** : PrimeNG détecte `prefers-color-scheme: dark` du système.

**Solution** : Forcer le mode light dans `app.config.ts` :

```typescript
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".app-dark", // ne s'active que si cette classe est sur <html>
    },
  },
});
```

### Favicon ne change pas

**Cause** : Cache navigateur.

**Solution** : Ajouter un cache-buster dans `index.html` :

```html
<link rel="icon" type="image/x-icon" href="favicon.ico?v=2" />
```

Ou vider le cache : `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows).

### Erreur `Could not resolve "@angular/animations/browser"`

**Cause** : Package manquant (requis par PrimeNG animations).

**Solution** :

```bash
cd apps/frontend && pnpm add @angular/animations
```

### Erreur `supertokens-web-js is not ESM`

**Cause** : Warning du build Angular (CommonJS dependency).

**Solution** : Ajouter dans `angular.json` sous `build.options` :

```json
"allowedCommonJsDependencies": ["supertokens-web-js"]
```

### Les images/assets ne s'affichent pas

**Cause** : Les fichiers statiques doivent être dans `apps/frontend/public/`.

**Solution** : Vérifier que les images sont dans `public/images/` et référencées sans `/` initial :

```html
<!-- Correct -->
<img src="images/tameri-logo1.png" />

<!-- Incorrect -->
<img src="/images/tameri-logo1.png" />
<img src="assets/images/tameri-logo1.png" />
```

### Mock data affichées au lieu des vraies données

**Cause** : Le backend n'est pas démarré ou l'API retourne une erreur.

**Solution** :

```bash
make docker-up    # Démarrer les services
make dev-backend  # Démarrer le backend
make db-setup     # Initialiser les bases CouchDB
```

Vérifier que `.env` contient `WEBSITE_DOMAIN=http://localhost:4200` pour le CORS.

## Backend

### Erreur CORS

**Cause** : `WEBSITE_DOMAIN` ne correspond pas à l'URL du frontend.

**Solution** : Dans `.env` :

```
WEBSITE_DOMAIN=http://localhost:4200
API_DOMAIN=http://localhost:3000
```

### CouchDB connection refused

**Cause** : Le conteneur Docker n'est pas démarré.

**Solution** :

```bash
make docker-up
make docker-ps     # Vérifier que couchdb est "healthy"
```

Vérifier `.env` :

```
COUCHDB_URL=http://admin:admin@localhost:5984
```

### SuperTokens connection refused

**Cause** : Le conteneur SuperTokens ou PostgreSQL n'est pas prêt.

**Solution** :

```bash
make docker-logs   # Vérifier les logs
docker compose restart supertokens
```

SuperTokens dépend de PostgreSQL — attendre que PostgreSQL soit "healthy" avant de redémarrer.

### ESLint échoue au commit (lint-staged)

**Cause** : La config lint-staged root essayait de lancer eslint sur les fichiers des sous-packages.

**Solution** : Le root `package.json` utilise uniquement `prettier --write` pour les `.ts`. ESLint est lancé par package via `pnpm run lint:backend` ou `pnpm run lint:frontend`.

## Docker

### Port déjà utilisé

**Cause** : Un autre processus utilise le port (3000, 5984, 9000, etc.).

**Solution** :

```bash
# Trouver le processus
lsof -i :3000

# Ou arrêter tous les conteneurs
make docker-clean
make docker-up
```

### Volumes corrompus

**Cause** : Données CouchDB/MinIO/PostgreSQL corrompues.

**Solution** :

```bash
make docker-clean   # Supprime conteneurs ET volumes
make docker-up
make db-setup
make minio-setup
```

## Commandes utiles

```bash
make help           # Liste toutes les commandes
make services       # Afficher les URLs des services
make docker-ps      # État des conteneurs
make docker-logs    # Logs en temps réel
make dev-frontend   # Frontend sur :4200
make dev-backend    # Backend sur :3000
make docs           # Documentation sur :3333
```
