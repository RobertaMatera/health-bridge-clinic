import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked} from '@angular/core';
import {RouterLink} from '@angular/router';
import {finalize} from 'rxjs';
import {Report} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {ReportsService} from '@app/reports/services/reports-service';
import {finalizationChecklist} from '@app/reports/models/finalization';
import {countOutOfRange} from '@app/exams/models/exam-range';
import {Exam} from '@app/exams/models/exam-model';
import {ExamsService} from '@app/exams/services/exams-service';
import {ExamsTable} from '@app/exams/components/exams-table/exams-table';
import {ExamDialog} from '@app/exams/components/exam-dialog/exam-dialog';
import {ReportStatusBadge} from '@app/reports/components/report-status-badge/report-status-badge';
import {ReportStepper} from '@app/reports/components/report-stepper/report-stepper';
import {FinalizationChecklist} from '@app/reports/components/finalization-checklist/finalization-checklist';
import {ReportSidebar} from '@app/reports/components/report-sidebar/report-sidebar';
import {ConfirmDialog} from '@app/commons/ui/confirm-dialog/confirm-dialog';
import {EmptyState} from '@app/commons/ui/empty-state/empty-state';
import {ToastService} from '@app/commons/ui/toast/toast-service';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {fullName} from '@app/users/models/user-name';

export const OUTCOME_MAX = 2000;

type ExamDialogState = {exam: Exam | null} | null;

@Component({
  selector: 'app-report-editor',
  imports: [
    RouterLink, ExamsTable, ExamDialog, ReportStatusBadge, ReportStepper, FinalizationChecklist,
    ReportSidebar, ConfirmDialog, EmptyState, TranslatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-editor.html'
})
export class ReportEditor {
  private readonly reportsService = inject(ReportsService);
  private readonly examsService = inject(ExamsService);
  private readonly toastService = inject(ToastService);
  private readonly i18n = inject(I18nService);

  report = input.required<Report>();
  /** Emitted with the updated report after a successful mutation. */
  changed = output<Report>();
  /** Asks the page to fetch the report again (exam changes return partial data). */
  reload = output();

  protected readonly outcomeMax = OUTCOME_MAX;
  protected readonly name = fullName;

  protected readonly outcome = signal('');
  protected readonly savedOutcome = signal('');
  protected readonly savingOutcome = signal(false);
  protected readonly examDialog = signal<ExamDialogState>(null);
  protected readonly examToDelete = signal<Exam | null>(null);
  protected readonly deleting = signal(false);
  protected readonly confirmingFinalize = signal(false);
  protected readonly finalizing = signal(false);

  protected readonly editable = computed(() => this.report().status !== ReportStatus.FINALIZED);
  protected readonly dirty = computed(() => this.outcome() !== this.savedOutcome());
  protected readonly outOfRange = computed(() => countOutOfRange(this.report().exams));
  protected readonly checklist = computed(() => finalizationChecklist(this.report(), this.outcome()));
  protected readonly missingLabels = computed(() =>
    this.checklist().missing.map(key => this.i18n.t(key).toLocaleLowerCase(this.i18n.locale())).join(', '));

  constructor() {
    // Reset the draft only when another report (or a new server version) arrives.
    effect(() => {
      const outcome = this.report().outcome ?? '';
      untracked(() => {
        this.outcome.set(outcome);
        this.savedOutcome.set(outcome);
      });
    });
  }

  protected onOutcomeInput(event: Event): void {
    this.outcome.set((event.target as HTMLTextAreaElement).value);
  }

  protected saveOutcome(): void {
    if (!this.dirty() || this.savingOutcome()) {
      return;
    }
    this.savingOutcome.set(true);
    this.reportsService.update(this.report().id, {patient: {email: this.report().patient.email}, outcome: this.outcome()})
      .pipe(finalize(() => this.savingOutcome.set(false)))
      .subscribe({
        next: report => {
          this.toastService.success('reports.outcome.saved');
          this.changed.emit(report);
        },
        error: error => this.toastService.httpError(error)
      });
  }

  protected onExamSaved(): void {
    this.examDialog.set(null);
    this.toastService.success('reports.exams.saved');
    this.reload.emit();
  }

  protected deleteExam(): void {
    const exam = this.examToDelete();
    if (!exam?.id) {
      return;
    }
    this.deleting.set(true);
    this.examsService.delete(exam.id)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.examToDelete.set(null);
          this.toastService.success('reports.exams.deleted');
          this.reload.emit();
        },
        error: error => {
          this.examToDelete.set(null);
          this.toastService.httpError(error);
        }
      });
  }

  protected requestFinalize(): void {
    // The button stays focusable while blocked (aria-disabled), so guard here.
    if (this.checklist().ready) {
      this.confirmingFinalize.set(true);
    }
  }

  protected finalizeReport(): void {
    this.finalizing.set(true);
    // The current draft is sent along, so unsaved outcome text is finalized too.
    this.reportsService.finalize(this.report().id, {patient: {email: this.report().patient.email}, outcome: this.outcome()})
      .pipe(finalize(() => this.finalizing.set(false)))
      .subscribe({
        next: report => {
          this.confirmingFinalize.set(false);
          this.toastService.success('reports.finalizeDialog.done', {id: report.id});
          this.changed.emit(report);
        },
        error: error => {
          this.confirmingFinalize.set(false);
          this.toastService.httpError(error);
        }
      });
  }
}
