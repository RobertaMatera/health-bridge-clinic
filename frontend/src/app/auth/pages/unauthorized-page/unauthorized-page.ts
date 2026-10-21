import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {StatusPage} from '@app/commons/ui/status-page/status-page';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-unauthorized-page',
  imports: [StatusPage, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-status-page code="403" tone="error" [heading]="'auth.unauthorized.title' | t" [text]="'auth.unauthorized.text' | t">
      <a routerLink="/reports" class="btn btn-primary btn-lg">{{ 'auth.unauthorized.back' | t }}</a>
    </app-status-page>
  `
})
export class UnauthorizedPage {
}
