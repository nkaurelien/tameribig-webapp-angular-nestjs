import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initSuperTokens } from './app/core/auth/supertokens.init';

initSuperTokens();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
