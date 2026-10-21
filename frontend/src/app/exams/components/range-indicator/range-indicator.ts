import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {Exam} from '@app/exams/models/exam-model';
import {rangeBar} from '@app/exams/models/exam-range';

/**
 * Mini bar showing where the value falls against the reference interval. Decorative: the
 * reference text and the flag next to it carry the same information for assistive tech.
 */
@Component({
  selector: 'app-range-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'aria-hidden': 'true', class: 'block'},
  template: `
    @if (bar(); as bar) {
      <span class="relative mt-1.5 block h-1.5 w-[120px] rounded-full bg-range-out">
        <span class="absolute inset-y-0 rounded-full bg-range-ok" [style.left.%]="bar.okStart" [style.width.%]="bar.okEnd - bar.okStart"></span>
        <span class="absolute -top-[3px] -ml-0.5 h-3 w-1 rounded-sm bg-ink" [style.left.%]="bar.marker"></span>
      </span>
    }
  `
})
export class RangeIndicator {
  exam = input.required<Pick<Exam, 'examValue' | 'refMin' | 'refMax'>>();
  protected readonly bar = computed(() => rangeBar(this.exam()));
}
