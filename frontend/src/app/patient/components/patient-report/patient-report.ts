import {afterNextRender, ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Report} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {ReportStatusBadge} from '@app/reports/components/report-status-badge/report-status-badge';
import {countOutOfRange} from '@app/exams/models/exam-range';
import {ExamFlag} from '@app/exams/components/exam-flag/exam-flag';
import {ExamRangePipe} from '@app/exams/pipes/exam-range-pipe';
import {Logo} from '@app/commons/components/logo/logo';
import {EmptyState} from '@app/commons/ui/empty-state/empty-state';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {LocalDatePipe} from '@app/commons/i18n/local-date-pipe';
import {LocalNumberPipe} from '@app/commons/i18n/local-number-pipe';
import {fullName} from '@app/users/models/user-name';
import {BOOKING_EMAIL} from '@app/patient/models/clinic-contact';

/**
 * Read-only report for the patient. Exams and outcome are only shown once the report is
 * finalized; "Download PDF" uses the browser's print dialog with the print stylesheet.
 */
@Component({
  selector: 'app-patient-report',
  imports: [
    RouterLink, ReportStatusBadge, ExamFlag, ExamRangePipe, Logo, EmptyState, TranslatePipe, LocalDatePipe, LocalNumberPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './patient-report.html'
})
export class PatientReport {
  report = input.required<Report>();
  // Set when opened from "Download PDF" in the list.
  printOnOpen = input(false);

  protected readonly name = fullName;
  protected readonly bookingEmail = BOOKING_EMAIL;
  protected readonly ready = computed(() => this.report().status === ReportStatus.FINALIZED);
  protected readonly outOfRange = computed(() => countOutOfRange(this.report().exams));
  protected readonly today = new Date();

  constructor() {
    afterNextRender(() => {
      if (this.printOnOpen() && this.ready()) {
        this.print();
      }
    });
  }

  protected print(): void {
    window.print();
  }
}
