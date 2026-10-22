import {InjectionToken, Type} from '@angular/core';
import {DemoAccount} from '@app/auth/models/demo-accounts';

/** What the app needs to know about the browser-only demo; provided only by the `demo` build. */
export interface DemoMode {
  accounts: readonly DemoAccount[];
  banner: Type<unknown>;
}

export const DEMO_MODE = new InjectionToken<DemoMode | null>('DEMO_MODE', {
  providedIn: 'root',
  factory: () => null
});
