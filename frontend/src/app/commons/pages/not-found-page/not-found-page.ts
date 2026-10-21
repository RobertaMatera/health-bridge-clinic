import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '@app/auth/services/auth-service';
import {StatusPage} from '@app/commons/ui/status-page/status-page';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-not-found-page',
  imports: [StatusPage, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-status-page code="404" [heading]="'statusPages.notFound.title' | t" [text]="'statusPages.notFound.text' | t">
      @if (authService.isLoggedIn()) {
        <a routerLink="/reports" class="btn btn-primary btn-lg">{{ 'statusPages.home' | t }}</a>
      } @else {
        <a routerLink="/login" class="btn btn-primary btn-lg">{{ 'statusPages.login' | t }}</a>
      }
    </app-status-page>
  `
})
export class NotFoundPage {
  protected readonly authService = inject(AuthService);
}
