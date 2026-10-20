import {ChangeDetectionStrategy, Component, input} from '@angular/core';

/** Empty, no-results and error placeholder. Project an action button as content. */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex flex-col items-center px-6 py-12 text-center'},
  template: `
    <span
      class="mb-4 inline-flex size-12 items-center justify-center rounded-card"
      [class]="tone() === 'error' ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-brand'"
      aria-hidden="true">
      <i class="fa-solid {{ icon() }} text-xl"></i>
    </span>
    <h2 class="text-lg">{{ heading() }}</h2>
    @if (text()) {
      <p class="mt-1.5 max-w-sm text-[15px] text-ink-soft">{{ text() }}</p>
    }
    <div class="mt-5 empty:hidden"><ng-content/></div>
  `
})
export class EmptyState {
  heading = input.required<string>();
  text = input<string>();
  icon = input('fa-file-lines');
  tone = input<'neutral' | 'error'>('neutral');
}
