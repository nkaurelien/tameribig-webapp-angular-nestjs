# Routes Frontend

## Structure de routing

```
/                      → redirect → /home
/auth/*                → AuthLayout (minimal)
  /auth/login          → LoginComponent
  /auth/register       → RegisterComponent
  /auth/forgot-password → ForgotPasswordComponent
  /auth/logout         → LogoutComponent
/home                  → MainLayout → HomeComponent
/explorer              → MainLayout → ExplorerComponent
/search                → MainLayout → SearchComponent
/topics                → MainLayout → TopicsComponent
/topics/:slug          → MainLayout → TopicDetailComponent
/console               → MainLayout → (P3 - à venir, auth required)
/coorporate/*          → MainLayout → (P4 - à venir)
/404                   → NotFoundComponent
/**                    → redirect → /404
```

## Layouts

### MainLayout

Contient la navigation (header sticky), le contenu (`<router-outlet>`), le footer et le bouton scroll-to-top. Utilisé pour toutes les pages publiques et authentifiées.

### AuthLayout

Layout minimal centré pour les pages d'authentification. Logo Tameri + carte blanche arrondie. Pas de navigation ni footer.

## Lazy loading

Toutes les routes utilisent le lazy loading via `loadChildren` :

```typescript
{
  path: 'explorer',
  loadChildren: () =>
    import('./features/explorer/explorer.routes').then(m => m.EXPLORER_ROUTES),
}
```

## Protection des routes

Les routes nécessitant une authentification utilisent `authGuard` :

```typescript
{
  path: 'console',
  canActivate: [authGuard],
  loadComponent: () => import('./features/console/console.component'),
}
```

## Pages implémentées

| Route                   | Composant               | Fonctionnalités                                                     |
| ----------------------- | ----------------------- | ------------------------------------------------------------------- |
| `/home`                 | HomeComponent           | Recherche Google-style, boutons media type 3D, honeycomb hexagonal  |
| `/explorer`             | ExplorerComponent       | Grille de médias, filtres pills par type, pagination "charger plus" |
| `/search`               | SearchComponent         | Barre de recherche, filtres 3D avec ring, recherche côté client     |
| `/topics`               | TopicsComponent         | Honeycomb hexagonal de catégories + liste accessible                |
| `/topics/:slug`         | TopicDetailComponent    | Header catégorie, filtres pills, grille de médias                   |
| `/auth/login`           | LoginComponent          | Email + password + remember me                                      |
| `/auth/register`        | RegisterComponent       | Email + password + confirmation                                     |
| `/auth/forgot-password` | ForgotPasswordComponent | Email + envoi lien                                                  |
| `/auth/logout`          | LogoutComponent         | Déconnexion SuperTokens + redirect                                  |
| `/404`                  | NotFoundComponent       | Masque africain + liens utiles                                      |

## Priorités restantes

| Priorité | Routes                      | Statut        |
| -------- | --------------------------- | ------------- |
| P1       | `/auth/*`, `/home`          | ✅ Implémenté |
| P2       | `/explorer`, `/search`      | ✅ Implémenté |
| P3       | `/topics`, `/topics/:slug`  | ✅ Implémenté |
| P3       | `/console`                  | En attente    |
| P4       | `/coorporate/*`, `/network` | En attente    |
