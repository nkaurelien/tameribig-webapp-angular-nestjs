import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Session from 'supertokens-web-js/recipe/session';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const exists = await Session.doesSessionExist();
  if (!exists) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
