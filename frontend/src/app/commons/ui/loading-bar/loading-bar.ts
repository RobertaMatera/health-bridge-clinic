import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router
} from '@angular/router';
import {LoadingService} from '@app/commons/ui/loading-bar/loading-service';

/**
 * Thin progress bar at the top of the viewport while a page or request is loading.
 * It fades in only after a short delay (see .loading-bar in styles.css), so fast responses
 * never flash. Decorative: pages announce their own loading state through skeletons.
 */
@Component({
  selector: 'app-loading-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'loading-bar',
    'aria-hidden': 'true',
    '[attr.data-active]': 'loadingService.busy()'
  },
  template: `<span class="loading-bar-indicator"></span>`
})
export class LoadingBar {
  protected readonly loadingService = inject(LoadingService);

  constructor() {
    inject(Router).events
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loadingService.setNavigating(true);
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel
          || event instanceof NavigationError || event instanceof NavigationSkipped) {
          this.loadingService.setNavigating(false);
        }
      });
  }
}
