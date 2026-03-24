# Authentification Frontend — SuperTokens

## Initialisation

SuperTokens est initialisé dans `main.ts` avant le bootstrap Angular :

```typescript
// main.ts
import { initSuperTokens } from "./app/core/auth/supertokens.init";

initSuperTokens();
bootstrapApplication(AppComponent, appConfig);
```

Configuration dans `core/auth/supertokens.init.ts` :

```typescript
SuperTokens.init({
  appInfo: {
    appName: "Tameri",
    apiDomain: "http://localhost:4200", // même origine via proxy
    apiBasePath: "/auth",
  },
  recipeList: [Session.init(), EmailPassword.init()],
});
```

## Intercepteur HTTP

L'intercepteur ajoute `withCredentials: true` à toutes les requêtes pour envoyer les cookies de session :

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
```

## AuthStore (NgRx Signal Store)

État global de l'authentification :

```typescript
const AuthStore = signalStore(
  { providedIn: "root" },
  withState({ isLoggedIn: false, userId: null, loading: true }),
  withMethods((store) => ({
    async checkSession() {
      /* vérifie Session.doesSessionExist() */
    },
    setLoggedIn(userId: string) {
      /* ... */
    },
    setLoggedOut() {
      /* ... */
    },
  })),
);
```

## Auth Guard

Protège les routes nécessitant une session active :

```typescript
export const authGuard: CanActivateFn = async () => {
  const exists = await Session.doesSessionExist();
  if (!exists) {
    inject(Router).navigate(["/auth/login"]);
    return false;
  }
  return true;
};
```

## Flux d'authentification

### Connexion

1. L'utilisateur remplit email + mot de passe
2. `EmailPassword.signIn()` envoie les credentials à `/auth/signin`
3. SuperTokens crée une session (cookies httpOnly)
4. `AuthStore.setLoggedIn(userId)` met à jour l'état
5. Redirect vers `/home`

### Inscription

1. L'utilisateur remplit email + mot de passe
2. `EmailPassword.signUp()` envoie à `/auth/signup`
3. SuperTokens crée le compte et la session
4. `AuthStore.setLoggedIn(userId)` met à jour l'état
5. Redirect vers `/home`

### Déconnexion

1. `Session.signOut()` invalide la session côté serveur
2. `AuthStore.setLoggedOut()` met à jour l'état
3. Redirect vers `/auth/login`
