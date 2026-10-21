import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from '@app/auth/services/auth-service';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {ToastService} from '@app/commons/ui/toast/toast-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const token = authService.token();

  if (!token) {
    return next(req);
  }

  return next(req.clone({setHeaders: {Authorization: `Basic ${token}`}}))
    .pipe(catchError((error: unknown) => {
      // Stored credentials no longer valid (e.g. password changed or database reset).
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.logout();
        toastService.error('errors.UNAUTHENTICATED');
      }
      return throwError(() => error);
    }));
};
