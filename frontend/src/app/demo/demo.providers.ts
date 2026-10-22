import {Provider} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import {DEMO_MODE, DemoMode} from '@app/demo/demo-mode';
import {DEMO_LOGIN_ACCOUNTS} from '@app/demo/demo-data';
import {DemoBanner} from '@app/demo/demo-banner';
import {demoApiInterceptor} from '@app/demo/demo-api';

/**
 * Demo build only: replaces no-demo.providers.ts through fileReplacements (angular.json,
 * `demo` configuration). The app then runs entirely in the browser against a mocked API.
 */
export const demoProviders: Provider[] = [
  {provide: DEMO_MODE, useValue: {accounts: DEMO_LOGIN_ACCOUNTS, banner: DemoBanner} satisfies DemoMode}
];

// Must stay last in the chain: earlier interceptors (loading bar, auth header) still run.
export const demoInterceptors: HttpInterceptorFn[] = [demoApiInterceptor];
