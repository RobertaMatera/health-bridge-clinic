import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@app/auth/services/auth-service';

export const roleGuard: CanActivateFn = route => {
  return inject(AuthService).hasRole(route.data['requiredRole']) ? true : inject(Router).parseUrl('/unauthorized');
};
