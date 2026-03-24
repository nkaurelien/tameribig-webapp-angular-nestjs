import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import EmailPassword from 'supertokens-web-js/recipe/emailpassword';
import { environment } from '../../../environments/environment';

export function initSuperTokens(): void {
  SuperTokens.init({
    appInfo: {
      appName: environment.supertokens.appName,
      apiDomain: environment.supertokens.apiDomain,
      apiBasePath: environment.supertokens.apiBasePath,
    },
    recipeList: [Session.init(), EmailPassword.init()],
  });
}
