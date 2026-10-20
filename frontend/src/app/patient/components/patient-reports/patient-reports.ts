import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {ReportsService} from '@app/reports/services/reports-service';
import {Report} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {ReportStatusBadge} from '@app/reports/components/report-status-badge/report-status-badge';
import {countOutOfRange} from '@app/exams/models/exam-range';
import {AuthService} from '@app/auth/services/auth-service';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {LocalDatePipe} from '@app/commons/i18n/local-date-pipe';
import {TranslationKey} from '@app/commons/i18n/i18n-types';
import {EmptyState} from '@app/commons/ui/empty-state/empty-state';
import {Skeleton} from '@app/commons/ui/skeleton/skeleton';
import {fullName} from '@app/users/models/user-name';
import {BOOKING_EMAIL, CLINIC_OFFICE_EMAIL} from '@app/patient/models/clinic-contact';

type LoadState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-patient-reports',
  imports: [RouterLink, ReportStatusBadge, TranslatePipe, LocalDatePipe, EmptyState, Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './patient-reports.html'
})
export class PatientReports {
  private readonly reportsService = inject(ReportsService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authService = inject(AuthService);

  protected readonly name = fullName;
  protected readonly outOfRange = countOutOfRange;
  protected readonly officeEmail = CLINIC_OFFICE_EMAIL;
  protected readonly bookingEmail = BOOKING_EMAIL;
  protected readonly finalized = ReportStatus.FINALIZED;

  protected readonly steps = [
    {title: 'patient.how.step1Title', text: 'patient.how.step1Text', tone: 'bg-created-soft text-created'},
    {title: 'patient.how.step2Title', text: 'patient.how.step2Text', tone: 'bg-progress-soft text-progress'},
    {title: 'patient.how.step3Title', text: 'patient.how.step3Text', tone: 'bg-final-soft text-final'}
  ] as const satisfies readonly {title: TranslationKey; text: TranslationKey; tone: string}[];

  protected readonly reports = signal<Report[]>([]);
  protected readonly state = signal<LoadState>('loading');

  protected readonly sortedReports = computed(() =>
    [...this.reports()].sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')));

  protected readonly latestReady = computed(() =>
    this.reports()
      .filter(report => report.status === ReportStatus.FINALIZED && report.finalizedAt)
      .sort((a, b) => b.finalizedAt!.localeCompare(a.finalizedAt!))[0] ?? null);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.state.set('loading');
    this.reportsService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: reports => {
          this.reports.set(reports);
          this.state.set('ready');
        },
        error: () => this.state.set('error')
      });
  }
}
