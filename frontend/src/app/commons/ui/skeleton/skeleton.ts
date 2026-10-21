import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

/** Placeholder rows shown while content loads; announced once as "Loading…". */
@Component({
  selector: 'app-skeleton',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex flex-col gap-3', role: 'status'},
  template: `
    <span class="sr-only">{{ 'common.loading' | t }}</span>
    @for (row of rowsArray(); track $index) {
      <div class="flex items-center gap-3" aria-hidden="true">
        @if (avatar()) {
          <div class="skeleton size-10 rounded-full"></div>
        }
        <div class="flex flex-1 flex-col gap-2">
          <div class="skeleton h-4" [style.width.%]="70 - ($index % 3) * 12"></div>
          <div class="skeleton h-3 w-2/5"></div>
        </div>
      </div>
    }
  `
})
export class Skeleton {
  rows = input(3);
  avatar = input(true);

  protected rowsArray(): number[] {
    return Array.from({length: this.rows()}, (_, i) => i);
  }
}
