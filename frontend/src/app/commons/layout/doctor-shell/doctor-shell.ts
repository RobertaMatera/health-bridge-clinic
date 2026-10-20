import {ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs';
import {DoctorNav} from '@app/commons/layout/doctor-nav/doctor-nav';
import {Logo} from '@app/commons/components/logo/logo';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

/**
 * Doctor layout: fixed sidebar from lg up; below lg a top bar whose menu button opens the same
 * navigation in a modal drawer (native <dialog>: focus trap, Esc, inert page behind it).
 */
@Component({
  selector: 'app-doctor-shell',
  imports: [DoctorNav, Logo, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-dvh lg:flex">
      <header class="hidden border-r border-line bg-surface px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col">
        <app-doctor-nav/>
      </header>

      <header class="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-surface py-2 pr-2 pl-4 lg:hidden print:hidden">
        <a routerLink="/reports" class="rounded-control" [attr.aria-label]="'common.home' | t">
          <app-logo size="sm" [tagline]="false"/>
        </a>
        <button
          #menuButton
          type="button"
          class="btn-icon text-ink"
          aria-controls="doctor-drawer"
          [attr.aria-expanded]="drawerOpen()"
          [attr.aria-label]="'common.openMenu' | t"
          (click)="openDrawer()">
          <i class="fa-solid fa-bars text-xl" aria-hidden="true"></i>
        </button>
      </header>

      <dialog
        #drawer
        id="doctor-drawer"
        class="drawer"
        [attr.aria-label]="'nav.main' | t"
        (close)="drawerOpen.set(false)">
        <div class="flex h-full flex-col px-4 pt-3 pb-6">
          <button
            type="button"
            class="btn-icon self-end"
            [attr.aria-label]="'common.closeMenu' | t"
            (click)="closeDrawer()">
            <i class="fa-solid fa-xmark text-xl" aria-hidden="true"></i>
          </button>
          @if (drawerOpen()) {
            <app-doctor-nav class="-mt-8"/>
          }
        </div>
      </dialog>

      <main id="main" tabindex="-1" class="min-w-0 flex-1 px-4 pt-5 pb-28 outline-none sm:px-6 lg:px-10 lg:pt-8 lg:pb-12">
        <div class="mx-auto max-w-[1120px]">
          <ng-content/>
        </div>
      </main>
    </div>
  `
})
export class DoctorShell {
  protected readonly drawerOpen = signal(false);
  private readonly drawer = viewChild.required<ElementRef<HTMLDialogElement>>('drawer');
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');

  constructor() {
    inject(Router).events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.closeDrawer());
  }

  protected openDrawer(): void {
    this.drawerOpen.set(true);
    this.drawer().nativeElement.showModal();
  }

  protected closeDrawer(): void {
    if (this.drawer().nativeElement.open) {
      this.drawer().nativeElement.close();
      this.menuButton().nativeElement.focus();
    }
  }
}
