export const SuperTokensBaseConfig = {
  framework: 'express' as const,
  supertokens: {
    connectionURI:
      process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567',
    apiKey: process.env.SUPERTOKENS_API_KEY || undefined,
  },
  appInfo: {
    appName: process.env.APP_NAME || 'Tameri',
    apiDomain: process.env.API_DOMAIN || 'http://localhost:3000',
    websiteDomain: process.env.WEBSITE_DOMAIN || 'http://localhost:4200',
    apiBasePath: '/api/auth',
    websiteBasePath: '/',
  },
};
