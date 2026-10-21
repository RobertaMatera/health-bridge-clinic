import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter, withNavigationErrorHandler, withViewTransitions} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from './app.routes';
import {authInterceptor} from './auth/interceptors/auth-interceptor';
import {loadingInterceptor} from './commons/ui/loading-bar/loading-interceptor';
import {redirectToErrorPage} from './commons/pages/error-page/error-page';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions({skipInitialTransition: true}),
      withNavigationErrorHandler(redirectToErrorPage)
    ),
    provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor]))
  ]
};
