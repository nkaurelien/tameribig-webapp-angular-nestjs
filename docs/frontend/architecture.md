# Architecture Frontend — Angular 19

## Stack

- **Angular 19** avec standalone components (pas de NgModules)
- **PrimeNG 21** (Aura theme) + **Tailwind CSS 4** + **tailwindcss-primeui**
- **Angular Signals** pour l'état local
- **NgRx Signal Store** pour l'état partagé (auth)
- **supertokens-web-js** pour l'authentification
- **HttpClient** avec `withFetch()` pour la compatibilité SuperTokens

## Structure

```
apps/frontend/src/app/
├── app.component.ts          # Composant racine (<router-outlet>)
├── app.config.ts             # Providers (router, http, primeng, animations)
├── app.routes.ts             # Routes top-level
├── core/
│   ├── auth/
│   │   ├── supertokens.init.ts   # Init SuperTokens SDK
│   │   ├── auth.interceptor.ts   # withCredentials: true
│   │   └── auth.guard.ts         # Vérifie la session
│   └── services/
│       └── api.service.ts        # Service HTTP générique
├── shared/
│   ├── components/
│   │   ├── navigation/           # Navbar responsive
│   │   └── footer/               # Footer
│   └── models/
│       ├── user.model.ts         # Interfaces User, PublicUserProfile
│       ├── media.model.ts        # Interfaces Media, PublicMedia, enums
│       └── topic.model.ts        # Interface Topic
├── features/
│   ├── auth/                     # Login, Register, Forgot-password, Logout
│   ├── home/                     # Page d'accueil (hero, topics, médias)
│   └── not-found/                # Page 404
├── layouts/
│   ├── main-layout/              # Nav + content + footer
│   └── auth-layout/              # Layout minimal centré
└── store/
    └── auth.store.ts             # NgRx Signal Store (auth state)
```

## Configuration (`app.config.ts`)

```typescript
providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withComponentInputBinding()),
  provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  provideAnimationsAsync(),
  providePrimeNG({ theme: { preset: Aura } }),
];
```

**`withFetch()`** est essentiel : SuperTokens intercepte `fetch()` globalement pour gérer les sessions automatiquement.

## Environnements

```typescript
// environment.ts (dev)
export const environment = {
  production: false,
  apiBaseUrl: "/api", // Proxied vers backend:3000
  supertokens: {
    appName: "Tameri",
    apiDomain: "http://localhost:4200", // Même origine via proxy
    apiBasePath: "/auth",
  },
};
```

## Proxy de développement

`proxy.conf.json` redirige `/api/*` et `/auth/*` vers le backend :

```json
{
  "/api": { "target": "http://localhost:3000" },
  "/auth": { "target": "http://localhost:3000" }
}
```
