import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@app/auth/services/auth-service';

export const authenticatedGuard: CanActivateFn = () => {
  return inject(AuthService).isLoggedIn() ? true : inject(Router).parseUrl('/login');
};
