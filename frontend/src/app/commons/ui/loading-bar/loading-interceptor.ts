import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {finalize} from 'rxjs';
import {LoadingService} from '@app/commons/ui/loading-bar/loading-service';

// finalize also runs when a request is cancelled, so the counter never gets stuck.
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.requestStarted();
  return next(req).pipe(finalize(() => loadingService.requestEnded()));
};
