import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ReportsService} from '@app/reports/services/reports-service';
import {Report} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {REPORT_STATUSES} from '@app/reports/models/report-status';
import {ReportStatusBadge} from '@app/reports/components/report-status-badge/report-status-badge';
import {NewReportDialog} from '@app/reports/components/new-report-dialog/new-report-dialog';
import {countOutOfRange} from '@app/exams/models/exam-range';
import {AuthService} from '@app/auth/services/auth-service';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {LocalDatePipe} from '@app/commons/i18n/local-date-pipe';
import {TranslationKey} from '@app/commons/i18n/i18n-types';
import {Avatar} from '@app/commons/ui/avatar/avatar';
import {EmptyState} from '@app/commons/ui/empty-state/empty-state';
import {Skeleton} from '@app/commons/ui/skeleton/skeleton';
import {ToastService} from '@app/commons/ui/toast/toast-service';
import {fullName} from '@app/users/models/user-name';

type StatusFilter = 'ALL' | ReportStatus;
type SortOrder = 'newest' | 'oldest' | 'patient';
type LoadState = 'loading' | 'ready' | 'error';

/**
 * Doctor's worklist. Reports are fetched once; filtering, search and sorting run on the client,
 * which keeps tab switches instant and lets the tabs show live counts.
 */
@Component({
  selector: 'app-doctor-reports',
  imports: [RouterLink, ReportStatusBadge, NewReportDialog, TranslatePipe, LocalDatePipe, Avatar, EmptyState, Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doctor-reports.html'
})
export class DoctorReports {
  private readonly reportsService = inject(ReportsService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authService = inject(AuthService);

  protected readonly statuses = REPORT_STATUSES;
  protected filterKey(status: ReportStatus): TranslationKey {
    return `reports.list.filters.${status}`;
  }

  protected readonly name = fullName;
  protected readonly outOfRange = countOutOfRange;

  protected readonly reports = signal<Report[]>([]);
  protected readonly state = signal<LoadState>('loading');
  private readonly queryParams = inject(ActivatedRoute).snapshot.queryParamMap;
  // ?status=CREATED and ?q=name let other pages link to a pre-filtered list.
  protected readonly statusFilter = signal<StatusFilter>(parseStatus(this.queryParams.get('status')));
  protected readonly query = signal(this.queryParams.get('q') ?? '');
  protected readonly sort = signal<SortOrder>('newest');
  protected readonly showCreateDialog = signal(false);

  protected readonly today = new Date();

  protected readonly greetingKey = computed<TranslationKey>(() => {
    const hour = this.today.getHours();
    if (hour < 12) {
      return 'reports.list.greetingMorning';
    }
    return hour < 18 ? 'reports.list.greetingAfternoon' : 'reports.list.greetingEvening';
  });

  protected readonly counts = computed(() => {
    const counts: Record<StatusFilter, number> = {ALL: 0, CREATED: 0, IN_PROGRESS: 0, FINALIZED: 0};
    for (const report of this.reports()) {
      counts.ALL++;
      counts[report.status]++;
    }
    return counts;
  });

  protected readonly finalizedThisWeek = computed(() => {
    const weekStart = startOfWeek(new Date());
    return this.reports().filter(report => report.finalizedAt && new Date(report.finalizedAt) >= weekStart).length;
  });

  // Out-of-range values only matter while the report can still be reviewed.
  protected readonly toReview = computed(() => {
    const open = this.reports().filter(report => report.status !== ReportStatus.FINALIZED);
    const perReport = open.map(report => countOutOfRange(report.exams));
    return {
      values: perReport.reduce((sum, count) => sum + count, 0),
      reports: perReport.filter(count => count > 0).length
    };
  });

  protected readonly visibleReports = computed(() => {
    const status = this.statusFilter();
    const query = normalize(this.query().trim().replace(/^#/, ''));
    const filtered = this.reports().filter(report =>
      (status === 'ALL' || report.status === status)
      && (!query || String(report.id) === query || normalize(fullName(report.patient)).includes(query)
        || normalize(`${report.patient.lastName} ${report.patient.firstName}`).includes(query)));

    const byDate = (report: Report) => report.updatedAt ?? report.createdAt ?? '';
    switch (this.sort()) {
      case 'oldest':
        return filtered.sort((a, b) => byDate(a).localeCompare(byDate(b)));
      case 'patient':
        return filtered.sort((a, b) => a.patient.lastName.localeCompare(b.patient.lastName) || b.id - a.id);
      default:
        return filtered.sort((a, b) => byDate(b).localeCompare(byDate(a)));
    }
  });

  protected readonly hasFilters = computed(() => this.statusFilter() !== 'ALL' || this.query().trim() !== '');

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

  protected setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected setSort(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortOrder);
  }

  protected clearFilters(): void {
    this.statusFilter.set('ALL');
    this.query.set('');
  }

  protected onCreated(report: Report): void {
    this.showCreateDialog.set(false);
    this.toastService.success('reports.create.created', {id: report.id});
    this.router.navigate(['/reports', report.id]);
  }

  /** "Today, 09:12", "Yesterday, 17:40" or a short date. */
  protected updatedLabel(value: string | undefined): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    const days = Math.round((startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / 86_400_000);
    const time = this.i18n.formatDate(date, 'time');
    if (days === 0) {
      return this.i18n.t('common.today', {time});
    }
    if (days === 1) {
      return this.i18n.t('common.yesterday', {time});
    }
    return this.i18n.formatDate(date, 'dateTime');
  }
}

function parseStatus(value: string | null): StatusFilter {
  return REPORT_STATUSES.find(status => status === value) ?? 'ALL';
}

function normalize(value: string): string {
  return value.toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  const offset = (day.getDay() + 6) % 7; // Monday = 0
  day.setDate(day.getDate() - offset);
  return day;
}
