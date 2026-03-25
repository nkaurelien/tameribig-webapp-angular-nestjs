# Routes Frontend

## Structure de routing

```
/                          → redirect → /home
/auth/*                    → AuthLayout (minimal)
  /auth/login              → LoginComponent
  /auth/register           → RegisterComponent
  /auth/forgot-password    → ForgotPasswordComponent
  /auth/reset-password     → ResetPasswordComponent (token via query param)
  /auth/logout             → LogoutComponent
/home                      → MainLayout → HomeComponent
/explorer                  → MainLayout → ExplorerComponent
/media/:id                 → MainLayout → MediaDetailComponent
/search                    → MainLayout → SearchComponent
/topics                    → MainLayout → TopicsComponent
/topics/:slug              → MainLayout → TopicDetailComponent
/console                   → MainLayout → ConsoleShell (auth required)
  /console/profile         → ProfileComponent
  /console/media           → MediaListComponent
  /console/media/upload    → MediaUploadComponent
  /console/media/:id/edit  → MediaEditComponent
  /console/settings        → SettingsComponent
/info/*                    → MainLayout
  /info/about              → AboutComponent
  /info/contact            → ContactComponent
  /info/faq                → FaqComponent
  /info/privacy            → PrivacyComponent
  /info/terms              → TermsComponent
/404                       → NotFoundComponent
/**                        → redirect → /404
```

## Layouts

### MainLayout

Navigation (header sticky avec logo + liens à gauche, actions à droite), contenu (`<router-outlet>`), footer et bouton scroll-to-top. Utilisé pour toutes les pages publiques et authentifiées.

### AuthLayout

Layout minimal centré avec logo Tameri + carte DaisyUI arrondie (`bg-base-100`). Pas de navigation ni footer.

## Lazy loading

Toutes les routes utilisent le lazy loading :

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
  loadChildren: () =>
    import('./features/console/console.routes').then(m => m.CONSOLE_ROUTES),
}
```

## Pages implémentées

| Route                     | Composant               | Fonctionnalités                                       |
| ------------------------- | ----------------------- | ----------------------------------------------------- |
| `/home`                   | HomeComponent           | Recherche, boutons media type, honeycomb hexagonal    |
| `/explorer`               | ExplorerComponent       | Grille de médias, filtres pills par type              |
| `/media/:id`              | MediaDetailComponent    | Preview, métadonnées, téléchargement, upvote, partage |
| `/search`                 | SearchComponent         | Barre de recherche, filtres, résultats                |
| `/topics`                 | TopicsComponent         | Honeycomb hexagonal + liste                           |
| `/topics/:slug`           | TopicDetailComponent    | Header catégorie, grille de médias                    |
| `/console/profile`        | ProfileComponent        | Édition du profil utilisateur                         |
| `/console/media`          | MediaListComponent      | Liste des médias avec filtres statut, actions CRUD    |
| `/console/media/upload`   | MediaUploadComponent    | Drag-and-drop, preview, progress bar, catégories      |
| `/console/media/:id/edit` | MediaEditComponent      | Édition métadonnées, publication                      |
| `/auth/login`             | LoginComponent          | Email + password + remember me                        |
| `/auth/register`          | RegisterComponent       | Email + password + confirmation                       |
| `/auth/forgot-password`   | ForgotPasswordComponent | Email + envoi lien                                    |
| `/auth/reset-password`    | ResetPasswordComponent  | Nouveau mot de passe (token via email)                |
| `/info/about`             | AboutComponent          | Mission, valeurs, CTA inscription                     |
| `/info/contact`           | ContactComponent        | Formulaire + coordonnées                              |
| `/info/faq`               | FaqComponent            | Accordion par section (Général, Créateurs, Paiements) |
| `/info/privacy`           | PrivacyComponent        | Politique de confidentialité complète                 |
| `/info/terms`             | TermsComponent          | CGU complètes                                         |
