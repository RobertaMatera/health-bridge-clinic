import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

const DISMISSED_KEY = 'hbc.demoBannerDismissed';

/** In the page flow above the layout, so it pushes content down instead of covering it. */
@Component({
  selector: 'app-demo-banner',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!dismissed()) {
      <div role="status" class="bg-brand-deep text-on-deep print:hidden">
        <div class="mx-auto flex max-w-[1120px] items-center gap-3 py-1 pr-1 pl-4 text-sm sm:px-6">
          <i class="fa-solid fa-flask shrink-0 text-mint" aria-hidden="true"></i>
          <p class="flex-1 py-2">
            <span class="font-semibold">{{ 'demo.banner.title' | t }}</span>
            <span class="text-on-deep-muted"> — {{ 'demo.banner.text' | t }}</span>
          </p>
          <button
            type="button"
            class="btn-icon text-on-deep hover:bg-deep-tile hover:text-on-deep"
            [attr.aria-label]="'demo.banner.dismiss' | t"
            (click)="dismiss()">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    }
  `
})
export class DemoBanner {
  protected readonly dismissed = signal(readDismissed());

  protected dismiss(): void {
    this.dismissed.set(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      // Without storage the banner simply comes back on the next visit.
    }
  }
}

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}
