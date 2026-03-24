# Authentification — SuperTokens

## Configuration

SuperTokens est configuré dans `apps/backend/src/auth/supertokens.config.ts` :

- **Recipes** : EmailPassword, Session, Dashboard, UserRoles
- **API Base Path** : `/auth`
- **Dashboard** : accessible via le SuperTokens Dashboard recipe

**Variables d'environnement** :

```
SUPERTOKENS_CONNECTION_URI=http://localhost:3567
SUPERTOKENS_API_KEY=<optionnel>
API_DOMAIN=http://localhost:3000
WEBSITE_DOMAIN=http://localhost:4200
```

## Endpoints

SuperTokens expose automatiquement ses endpoints sous `/auth/*` :

| Endpoint                               | Description                    |
| -------------------------------------- | ------------------------------ |
| `POST /auth/signup`                    | Inscription (email + password) |
| `POST /auth/signin`                    | Connexion                      |
| `POST /auth/signout`                   | Déconnexion                    |
| `POST /auth/user/password/reset/token` | Demande de reset               |
| `GET /auth/session/refresh`            | Rafraîchir la session          |

## Protection des routes

### Backend

```typescript
import { VerifySession } from "supertokens-nestjs";

@Controller("users")
export class UsersController {
  @Get("me")
  @VerifySession()
  getProfile(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    // ...
  }
}
```

### Frontend

```typescript
import { authGuard } from './core/auth/auth.guard';

// Dans les routes
{
  path: 'console',
  canActivate: [authGuard],
  loadComponent: () => import('./features/console/console.component'),
}
```

## CORS

Le backend autorise les requêtes du frontend avec les headers SuperTokens :

```typescript
app.enableCors({
  origin: [process.env.WEBSITE_DOMAIN],
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  credentials: true,
});
```

## Migration future : Zitadel OIDC

SuperTokens est la solution intermédiaire. L'objectif final est **Zitadel OIDC** pour une solution d'auth self-hosted complète avec SSO.
