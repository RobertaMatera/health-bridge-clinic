import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {Report} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {LocalDatePipe} from '@app/commons/i18n/local-date-pipe';
import {NgTemplateOutlet} from '@angular/common';

/** Created → In progress → Finalized, with the current step marked by aria-current="step". */
@Component({
  selector: 'app-report-stepper',
  imports: [TranslatePipe, LocalDatePipe, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-stepper.html'
})
export class ReportStepper {
  report = input.required<Report>();

  protected readonly step = computed(() => {
    switch (this.report().status) {
      case ReportStatus.CREATED:
        return 1;
      case ReportStatus.IN_PROGRESS:
        return 2;
      default:
        return 3;
    }
  });
}
