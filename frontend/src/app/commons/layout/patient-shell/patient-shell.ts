import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '@app/auth/services/auth-service';
import {Logo} from '@app/commons/components/logo/logo';
import {LanguageSwitcher} from '@app/commons/components/language-switcher/language-switcher';
import {Avatar} from '@app/commons/ui/avatar/avatar';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {fullName} from '@app/users/models/user-name';

@Component({
  selector: 'app-patient-shell',
  imports: [RouterLink, Logo, LanguageSwitcher, Avatar, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 border-b border-line bg-surface print:hidden">
      <div class="mx-auto flex max-w-[1040px] items-center justify-between gap-3 py-2 pr-2 pl-4 sm:px-6 sm:py-3">
        <a routerLink="/reports" class="rounded-control" [attr.aria-label]="'common.home' | t">
          <app-logo class="sm:hidden" size="sm" [tagline]="false"/>
          <app-logo class="max-sm:hidden"/>
        </a>
        <div class="flex items-center gap-1 sm:gap-2">
          <app-language-switcher/>
          @if (authService.user(); as user) {
            <div class="flex items-center gap-2.5 rounded-full border border-line py-1 pr-1 pl-1 sm:pl-3">
              <span class="text-[15px] font-semibold max-sm:sr-only">{{ name(user) }}</span>
              <app-avatar [firstName]="user.firstName" [lastName]="user.lastName" size="sm"/>
            </div>
          }
          <button type="button" class="btn btn-ghost px-3" (click)="authService.logout()">
            <i class="fa-solid fa-arrow-right-from-bracket sm:hidden" aria-hidden="true"></i>
            <span class="max-sm:sr-only">{{ 'common.logout' | t }}</span>
          </button>
        </div>
      </div>
    </header>

    <main id="main" tabindex="-1" class="mx-auto max-w-[1040px] px-4 pt-6 pb-12 outline-none sm:px-6 sm:pt-9 sm:pb-14">
      <ng-content/>
    </main>
  `
})
export class PatientShell {
  protected readonly authService = inject(AuthService);
  protected readonly name = fullName;
}
