import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {AuthService} from '@app/auth/services/auth-service';
import {Logo} from '@app/commons/components/logo/logo';
import {LanguageSwitcher} from '@app/commons/components/language-switcher/language-switcher';

/**
 * Full-page message for 404, 403 and load errors. Signed-in users see it inside their shell;
 * guests have no shell, so it fills the screen and brings its own logo and language switch.
 * Project the actions as content.
 */
@Component({
  selector: 'app-status-page',
  imports: [Logo, LanguageSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative flex flex-col items-center text-center',
    '[class]': 'standalone() ? "min-h-dvh justify-center px-4 py-16" : "py-12 sm:py-20"'
  },
  template: `
    @if (standalone()) {
      <app-language-switcher class="absolute top-4 right-4"/>
      <app-logo class="mb-12"/>
    }

    @if (code()) {
      <p class="font-mono text-7xl leading-none font-semibold tracking-tight sm:text-8xl" [class]="codeColor()" aria-hidden="true">
        {{ code() }}
      </p>
    } @else {
      <span class="inline-flex size-16 items-center justify-center rounded-card bg-danger-soft text-danger" aria-hidden="true">
        <i class="fa-solid {{ icon() }} text-2xl"></i>
      </span>
    }

    <h1 class="mt-6 text-2xl sm:text-[32px]">{{ heading() }}</h1>
    <p class="mt-3 max-w-md text-base leading-relaxed text-ink-soft">{{ text() }}</p>
    <div class="mt-8 flex w-full flex-col-reverse gap-2 empty:hidden sm:w-auto sm:flex-row sm:justify-center">
      <ng-content/>
    </div>
  `
})
export class StatusPage {
  heading = input.required<string>();
  text = input.required<string>();
  // A short code such as "404"; without one, the icon is shown instead.
  code = input<string>();
  icon = input('fa-triangle-exclamation');
  tone = input<'brand' | 'error'>('brand');

  private readonly authService = inject(AuthService);

  protected readonly standalone = computed(() => !this.authService.isLoggedIn());
  protected readonly codeColor = computed(() => this.tone() === 'error' ? 'text-danger' : 'text-brand');
}
