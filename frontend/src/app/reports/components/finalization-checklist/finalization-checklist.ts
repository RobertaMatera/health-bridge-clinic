import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FinalizationChecklist as Checklist} from '@app/reports/models/finalization';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-finalization-checklist',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card p-5" aria-labelledby="checklist-title">
      <h2 id="checklist-title" class="card-title mb-3.5">{{ 'reports.checklist.title' | t }}</h2>
      <ul class="flex flex-col gap-3">
        @for (item of checklist().items; track item.key) {
          <li class="flex items-start gap-2.5 text-[15px] leading-snug">
            @if (item.done) {
              <i class="fa-solid fa-check mt-0.5 w-5 text-center text-final" aria-hidden="true"></i>
              <span>{{ item.key | t }} <span class="sr-only">({{ 'reports.checklist.done' | t }})</span></span>
            } @else {
              <i class="fa-solid fa-circle-exclamation mt-0.5 w-5 text-center text-danger" aria-hidden="true"></i>
              <strong>{{ item.key | t }} <span class="sr-only">({{ 'reports.checklist.missing' | t }})</span></strong>
            }
          </li>
        }
      </ul>
      <p [id]="reasonId()" class="note mt-4">
        @if (!checklist().ready) {
          <strong class="mb-1 block text-danger">{{ 'reports.checklist.blocked' | t: {items: missingLabels()} }}</strong>
        }
        {{ 'reports.checklist.note' | t }}
      </p>
    </section>
  `
})
export class FinalizationChecklist {
  checklist = input.required<Checklist>();
  // Translated names of missing items, joined by the parent.
  missingLabels = input.required<string>();
  // Referenced by the Finalize button's aria-describedby.
  reasonId = input.required<string>();
}
