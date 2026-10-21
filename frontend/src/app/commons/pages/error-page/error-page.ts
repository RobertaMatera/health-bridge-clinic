import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NavigationError, RedirectCommand, Router, RouterLink} from '@angular/router';
import {AuthService} from '@app/auth/services/auth-service';
import {StatusPage} from '@app/commons/ui/status-page/status-page';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

/** Router state passed by redirectToErrorPage. */
interface ErrorPageState {
  retryUrl?: string;
}

/**
 * Navigation error handler (withNavigationErrorHandler): a page that fails to load shows the
 * error page, while the address bar keeps the requested URL so the user can retry it.
 * Runs in an injection context.
 */
export function redirectToErrorPage(error: NavigationError): RedirectCommand {
  return new RedirectCommand(inject(Router).parseUrl('/error'), {
    skipLocationChange: true,
    state: {retryUrl: error.url} satisfies ErrorPageState
  });
}

/**
 * Shown when a page cannot be loaded, e.g. a lazy chunk fails offline or after a new deploy.
 * The address bar keeps the failed URL (skipLocationChange), and "Try again" reloads it fully,
 * which also picks up a newer build.
 */
@Component({
  selector: 'app-error-page',
  imports: [StatusPage, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-status-page icon="fa-plug-circle-exclamation" [heading]="'statusPages.error.title' | t" [text]="'statusPages.error.text' | t">
      @if (authService.isLoggedIn()) {
        <a routerLink="/reports" class="btn btn-secondary btn-lg">{{ 'statusPages.home' | t }}</a>
      } @else {
        <a routerLink="/login" class="btn btn-secondary btn-lg">{{ 'statusPages.login' | t }}</a>
      }
      <button type="button" class="btn btn-primary btn-lg" (click)="retry()">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>{{ 'statusPages.error.retry' | t }}
      </button>
    </app-status-page>
  `
})
export class ErrorPage {
  protected readonly authService = inject(AuthService);
  private readonly retryUrl = (inject(Router).currentNavigation()?.extras.state as ErrorPageState | undefined)?.retryUrl;

  protected retry(): void {
    window.location.assign(this.retryUrl ?? '/');
  }
}
