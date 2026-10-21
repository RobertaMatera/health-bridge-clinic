import {TestBed} from '@angular/core/testing';
import {Location} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter, withNavigationErrorHandler} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {ErrorPage, redirectToErrorPage} from '@app/commons/pages/error-page/error-page';
import {NotFoundPage} from '@app/commons/pages/not-found-page/not-found-page';

describe('status pages', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('hbc.language', 'en');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter([
          {path: 'broken', loadComponent: () => Promise.reject(new Error('Failed to fetch chunk'))},
          {path: 'error', component: ErrorPage},
          {path: '**', component: NotFoundPage}
        ], withNavigationErrorHandler(redirectToErrorPage))
      ]
    });
  });

  it('shows the 404 page for an unknown address, with a sign-in link for guests', async () => {
    const harness = await RouterTestingHarness.create('/does-not-exist');

    const page = harness.routeNativeElement!;
    expect(page.querySelector('h1')?.textContent).toContain('Page not found');
    expect(page.querySelector('a')?.getAttribute('href')).toBe('/login');
  });

  it('shows the error page when a page fails to load and keeps the requested address', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/broken');

    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toContain('Something went wrong');
    expect(TestBed.inject(Location).path()).not.toBe('/error');
  });
});
