import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Session from 'supertokens-web-js/recipe/session';
import { UserRoleClaim } from 'supertokens-web-js/recipe/userroles';

export function roleGuard(...roles: string[]): CanActivateFn {
  return async () => {
    const router = inject(Router);

    if (!(await Session.doesSessionExist())) {
      router.navigate(['/auth/login']);
      return false;
    }

    const validationErrors = await Session.validateClaims({
      overrideGlobalClaimValidators: (globalValidators) => [
        ...globalValidators,
        UserRoleClaim.validators.includesAny(roles),
      ],
    });

    if (validationErrors.length === 0) {
      return true;
    }

    router.navigate(['/404']);
    return false;
  };
}
