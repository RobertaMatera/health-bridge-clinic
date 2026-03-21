import {HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from '@app/auth/services/auth-service';
import {inject} from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    const credentials = authService.token();
    const cloned = req.clone({
      setHeaders: {Authorization: `Basic ${credentials}`}
    });
    return next(cloned);
  }

  return next(req);
};

