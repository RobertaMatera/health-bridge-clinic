import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {StatusAudience, statusBadgeClass, statusKey} from '@app/reports/models/report-status';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

/** Status pill: colour, dot and text label together, so colour is never the only signal. */
@Component({
  selector: 'app-report-status-badge',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="classes()">{{ labelKey() | t }}</span>`
})
export class ReportStatusBadge {
  status = input.required<ReportStatus>();
  audience = input<StatusAudience>('doctor');
  size = input<'sm' | 'md'>('md');

  protected readonly labelKey = computed(() => statusKey(this.status(), this.audience()));
  protected readonly classes = computed(() => `${statusBadgeClass(this.status())} ${this.size() === 'sm' ? 'badge-sm' : ''}`);
}
