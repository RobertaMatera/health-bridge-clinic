import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@app/auth/services/auth-service';

/** Keeps signed-in users away from the login page. */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn() ? inject(Router).parseUrl('/reports') : true;
};
