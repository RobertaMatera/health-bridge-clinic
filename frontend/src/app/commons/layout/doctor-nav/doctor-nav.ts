import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '@app/auth/services/auth-service';
import {Logo} from '@app/commons/components/logo/logo';
import {LanguageSwitcher} from '@app/commons/components/language-switcher/language-switcher';
import {Avatar} from '@app/commons/ui/avatar/avatar';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {fullName} from '@app/users/models/user-name';

/** Sidebar content for doctors, shared by the desktop sidebar and the mobile drawer. */
@Component({
  selector: 'app-doctor-nav',
  imports: [RouterLink, RouterLinkActive, Logo, LanguageSwitcher, Avatar, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex h-full flex-col gap-7'},
  template: `
    <a routerLink="/reports" class="self-start rounded-control px-2" [attr.aria-label]="'common.home' | t">
      <app-logo/>
    </a>

    <nav [attr.aria-label]="'nav.main' | t">
      <ul class="flex flex-col gap-1">
        <li>
          <a routerLink="/reports" routerLinkActive="active" ariaCurrentWhenActive="page" class="nav-link">
            <i class="fa-regular fa-file-lines w-5 text-center" aria-hidden="true"></i>
            {{ 'nav.reports' | t }}
          </a>
        </li>
        <li>
          <a routerLink="/analytics" routerLinkActive="active" ariaCurrentWhenActive="page" class="nav-link">
            <i class="fa-solid fa-chart-simple w-5 text-center" aria-hidden="true"></i>
            {{ 'nav.statistics' | t }}
          </a>
        </li>
      </ul>
    </nav>

    <div class="mt-auto flex flex-col gap-3">
      <app-language-switcher class="px-1"/>
      @if (authService.user(); as user) {
        <div class="flex items-center gap-2.5 rounded-xl border border-line p-3">
          <app-avatar [firstName]="user.firstName" [lastName]="user.lastName" size="sm" tone="brand"/>
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-semibold">{{ 'common.doctorName' | t: {name: name(user)} }}</div>
            <div class="text-[13px] text-muted">{{ 'roles.DOCTOR' | t }}</div>
          </div>
          <button type="button" class="btn-icon" [attr.aria-label]="'common.logout' | t" (click)="authService.logout()">
            <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
  `
})
export class DoctorNav {
  protected readonly authService = inject(AuthService);
  protected readonly name = fullName;
}
