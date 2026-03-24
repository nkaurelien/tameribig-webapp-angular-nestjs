import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';

const connectionURI =
  process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567';
const apiKey = process.env.SUPERTOKENS_API_KEY || undefined;

export const SuperTokensConfig = {
  framework: 'express' as const,
  supertokens: {
    connectionURI,
    apiKey,
  },
  appInfo: {
    appName: process.env.APP_NAME || 'Tameri',
    apiDomain: process.env.API_DOMAIN || 'http://localhost:3000',
    websiteDomain: process.env.WEBSITE_DOMAIN || 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
  },
  recipeList: [
    EmailPassword.init(),
    Session.init(),
    Dashboard.init(),
    UserRoles.init(),
  ],
};
