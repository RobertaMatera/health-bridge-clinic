import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@app/auth/services/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (authService.hasRole(route.data['requiredRole'])) {
    return true;
  }

  const router = inject(Router);
  router.navigate(['/unauthorized']);
  return false;
};
