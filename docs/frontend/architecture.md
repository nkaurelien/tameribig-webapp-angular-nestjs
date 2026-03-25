# Architecture Frontend — Angular 19

## Stack

- **Angular 19** avec standalone components (pas de NgModules)
- **DaisyUI 5** (thème custom "tameri") + **Tailwind CSS 4**
- **Angular Signals** pour l'état local
- **NgRx Signal Store** pour l'état partagé (auth, user)
- **supertokens-web-js** pour l'authentification
- **HttpClient** avec `withFetch()` pour la compatibilité SuperTokens

## Structure

```
apps/frontend/src/app/
├── app.component.ts          # Composant racine (<router-outlet>)
├── app.config.ts             # Providers (router, http, animations)
├── app.routes.ts             # Routes top-level
├── core/
│   ├── auth/
│   │   ├── supertokens.init.ts   # Init SuperTokens SDK
│   │   ├── auth.interceptor.ts   # withCredentials: true
│   │   └── auth.guard.ts         # Vérifie la session
│   ├── services/
│   │   ├── api.service.ts        # Service HTTP générique
│   │   ├── media-api.service.ts  # Service média (CRUD, upload, download, upvote)
│   │   └── user-api.service.ts   # Service utilisateur
│   └── site.config.ts            # Constantes du site (nom, email, domaine, etc.)
├── shared/
│   ├── components/
│   │   ├── navigation/           # Navbar responsive DaisyUI
│   │   ├── footer/               # Footer DaisyUI
│   │   └── media-card/           # Card média réutilisable
│   └── models/
│       ├── user.model.ts         # Interfaces User, PublicUserProfile
│       ├── media.model.ts        # Interfaces Media, PublicMedia, enums
│       └── topic.model.ts        # Interface Topic
├── features/
│   ├── auth/                     # Login, Register, Forgot-password, Reset-password, Logout
│   ├── home/                     # Page d'accueil (hero, topics, médias)
│   ├── explorer/                 # Galerie de médias publics
│   ├── media-detail/             # Page de détail + téléchargement
│   ├── search/                   # Recherche de médias
│   ├── topics/                   # Catégories + détail par topic
│   ├── console/                  # Dashboard utilisateur (profil, médias, paramètres)
│   ├── info/                     # Pages statiques (about, contact, FAQ, privacy, terms)
│   └── not-found/                # Page 404
├── layouts/
│   ├── main-layout/              # Nav + content + footer
│   └── auth-layout/              # Layout minimal centré
└── store/
    ├── auth.store.ts             # NgRx Signal Store (auth state)
    └── user.store.ts             # NgRx Signal Store (user profile)
```

## Configuration (`app.config.ts`)

```typescript
providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withComponentInputBinding()),
  provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  provideAnimationsAsync(),
];
```

> PrimeNG a été retiré au profit de DaisyUI 5. Le provider `providePrimeNG()` n'est plus utilisé.

## Configuration centralisée (`site.config.ts`)

```typescript
export const siteConfig = {
  name: "Tameri",
  tagline: "Plateforme de partage de médias créatifs",
  domain: "tameribig.kamitbrains.fr",
  email: "contact@tameribig.kamitbrains.fr",
  social: { facebook, instagram, twitter, youtube, linkedin },
  contact: { phone, whatsapp, address, hours },
  legal: { companyName, country, law },
  media: {
    maxFileSizeMb,
    acceptedImages,
    acceptedVideos,
    acceptedAudio,
    currency,
  },
};
```

Utilisé par les composants footer, contact, privacy, terms pour éviter les valeurs en dur.

## Environnements

```typescript
// environment.ts (dev)
export const environment = {
  production: false,
  apiBaseUrl: "/api",
  supertokens: {
    appName: "Tameri",
    apiDomain: "http://localhost:4200",
    apiBasePath: "/api/auth",
  },
};
```

## Proxy de développement

`proxy.conf.json` redirige `/api/*` vers le backend :

```json
{
  "/api": { "target": "http://localhost:3000" }
}
```
