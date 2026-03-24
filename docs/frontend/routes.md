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
/explorer/*            → MainLayout → (P2 - à venir)
/search                → MainLayout → (P2 - à venir)
/topics                → MainLayout → (P3 - à venir)
/console               → MainLayout → (P3 - à venir, auth required)
/coorporate/*          → MainLayout → (P4 - à venir)
/404                   → NotFoundComponent
/**                    → redirect → /404
```

## Layouts

### MainLayout

Contient la navigation, le contenu (`<router-outlet>`) et le footer. Utilisé pour toutes les pages publiques et authentifiées.

### AuthLayout

Layout minimal centré pour les pages d'authentification. Pas de navigation ni footer.

## Lazy loading

Toutes les routes utilisent le lazy loading via `loadComponent` / `loadChildren` :

```typescript
{
  path: 'home',
  loadChildren: () =>
    import('./features/home/home.routes').then(m => m.HOME_ROUTES),
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

## Priorités de migration

| Priorité | Routes                      | Statut        |
| -------- | --------------------------- | ------------- |
| P1       | `/auth/*`, `/home`          | ✅ Implémenté |
| P2       | `/explorer/*`, `/search`    | En attente    |
| P3       | `/topics`, `/console`       | En attente    |
| P4       | `/coorporate/*`, `/network` | En attente    |
