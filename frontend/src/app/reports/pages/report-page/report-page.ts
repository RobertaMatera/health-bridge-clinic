import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Report} from '@app/reports/models/report-model';
import {ReportsService} from '@app/reports/services/reports-service';
import {ReportEditor} from '@app/reports/components/report-editor/report-editor';
import {ExamsTable} from '@app/exams/components/exams-table/exams-table';
import {AuthService} from '@app/auth/services/auth-service';
import {EmptyState} from '@app/commons/ui/empty-state/empty-state';
import {Skeleton} from '@app/commons/ui/skeleton/skeleton';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

type LoadState = 'loading' | 'ready' | 'notFound' | 'error';

@Component({
  selector: 'app-report-page',
  imports: [ReportEditor, ExamsTable, EmptyState, Skeleton, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-page.html'
})
export class ReportPage {
  private readonly reportsService = inject(ReportsService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly authService = inject(AuthService);

  protected readonly report = signal<Report | null>(null);
  protected readonly state = signal<LoadState>('loading');
  private reportId = 0;

  constructor() {
    inject(ActivatedRoute).paramMap
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        this.reportId = Number(params.get('id'));
        this.report.set(null);
        this.load();
      });
  }

  protected load(): void {
    if (!Number.isInteger(this.reportId) || this.reportId <= 0) {
      this.state.set('notFound');
      return;
    }
    if (!this.report()) {
      this.state.set('loading');
    }
    this.reportsService.getByID(this.reportId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: report => {
          this.report.set(report);
          this.state.set('ready');
        },
        error: (error: unknown) =>
          this.state.set(error instanceof HttpErrorResponse && error.status === 404 ? 'notFound' : 'error')
      });
  }
}
