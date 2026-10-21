import {TestBed} from '@angular/core/testing';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {LoadingService} from '@app/commons/ui/loading-bar/loading-service';
import {loadingInterceptor} from '@app/commons/ui/loading-bar/loading-interceptor';

describe('loadingInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let loading: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([loadingInterceptor])), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    loading = TestBed.inject(LoadingService);
  });

  it('stays busy until every parallel request has finished', () => {
    http.get('/a').subscribe();
    http.get('/b').subscribe();
    expect(loading.busy()).toBe(true);

    controller.expectOne('/a').flush({});
    expect(loading.busy()).toBe(true);

    controller.expectOne('/b').flush({});
    expect(loading.busy()).toBe(false);
  });

  it('clears the busy state when a request fails', () => {
    http.get('/a').subscribe({error: () => undefined});
    controller.expectOne('/a').flush(null, {status: 500, statusText: 'Server Error'});
    expect(loading.busy()).toBe(false);
  });

  it('clears the busy state when a request is cancelled', () => {
    const subscription = http.get('/a').subscribe();
    subscription.unsubscribe();
    expect(loading.busy()).toBe(false);
  });

  it('is busy while navigating even without requests', () => {
    loading.setNavigating(true);
    expect(loading.busy()).toBe(true);
    loading.setNavigating(false);
    expect(loading.busy()).toBe(false);
  });
});
