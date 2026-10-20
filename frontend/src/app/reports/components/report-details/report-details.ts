import {Component, computed, inject, input, output, signal} from '@angular/core';
import {Report} from '@app/reports/models/report-model';
import {ExamDialog} from '@app/exams/components/exam-dialog/exam-dialog';
import {Exam} from '@app/exams/models/exam-model';
import {ExamsService} from '@app/exams/services/exams-service';
import {ReportsService} from '@app/reports/services/reports-service';
import {ReportForm} from '@app/reports/components/report-form/report-form';
import {ToastService} from '@app/commons/ui/toast/toast-service';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {UserRole} from '@app/users/models/user-role-enum';
import {AuthService} from '@app/auth/services/auth-service';

@Component({
  selector: 'app-report-details',
  imports: [
    ExamDialog,
    ReportForm
  ],
  templateUrl: './report-details.html'
})
export class ReportDetails {

  examsService = inject(ExamsService);
  reportsService = inject(ReportsService);
  toastService = inject(ToastService);

  currentUser = inject(AuthService).user;
  report = input.required<Report>();
  editingExam = signal<Exam | null>(null);
  canEdit = computed(() => this.report().status !== ReportStatus.FINALIZED && this.currentUser()?.role === UserRole.DOCTOR);
  change = output();

  deleteExam(exam: Exam) {
    if (!exam.id) {
      return;
    }

    this.examsService.delete(exam.id)
      .subscribe({
        next: () => this.change.emit(),
        error: error => this.toastService.httpError(error)
      });
  }

  openCreateExamDialog() {
    this.editingExam.set({
      analysis: '',
      unitOfMeasure: '',
      examValue: 0
    });
  }

  saveReport(updatedReport: Report) {
    if (!updatedReport.id) {
      return;
    }

    this.reportsService.update(updatedReport.id, {patient: updatedReport.patient, outcome: updatedReport.outcome ?? null})
      .subscribe({
        next: () => this.change.emit(),
        error: error => this.toastService.httpError(error)
      });
  }

  finalizeReport(updatedReport: Report) {
    if (!updatedReport.id) {
      return;
    }

    this.reportsService.finalize(updatedReport.id, {patient: updatedReport.patient, outcome: updatedReport.outcome ?? null})
      .subscribe({
        next: () => this.change.emit(),
        error: error => this.toastService.httpError(error)
      });
  }

  onDialogConfirm() {
    this.editingExam.set(null);
    this.change.emit();
  }

  protected readonly UserRole = UserRole;
}
