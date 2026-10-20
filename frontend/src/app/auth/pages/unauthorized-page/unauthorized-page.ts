import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {EmptyState} from '@app/commons/ui/empty-state/empty-state';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-unauthorized-page',
  imports: [EmptyState, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card mx-auto mt-6 max-w-xl">
      <app-empty-state
        icon="fa-lock"
        tone="error"
        [heading]="'auth.unauthorized.title' | t"
        [text]="'auth.unauthorized.text' | t">
        <a routerLink="/reports" class="btn btn-primary btn-lg">{{ 'auth.unauthorized.back' | t }}</a>
      </app-empty-state>
    </section>
  `
})
export class UnauthorizedPage {
}
