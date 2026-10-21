import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from './app.routes';
import {authInterceptor} from './auth/interceptors/auth-interceptor';
import {loadingInterceptor} from './commons/ui/loading-bar/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions({skipInitialTransition: true})),
    provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor]))
  ]
};
