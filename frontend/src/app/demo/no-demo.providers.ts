import {Provider} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';

/**
 * Normal builds: nothing. The `demo` configuration in angular.json swaps this file for
 * demo.providers.ts, so the mock API and its data never reach the production bundle.
 */
export const demoProviders: Provider[] = [];

export const demoInterceptors: HttpInterceptorFn[] = [];
