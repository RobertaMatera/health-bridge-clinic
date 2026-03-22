import {Component, inject, input, output, signal} from '@angular/core';
import {Report} from '@app/reports/models/report-model';
import {ExamDialog} from '@app/exams/components/exam-dialog/exam-dialog';
import {Exam} from '@app/exams/models/exam-model';
import {ExamsService} from '@app/exams/services/exams-service';
import {ReportsService} from '@app/reports/services/reports-service';
import {ReportForm} from '@app/reports/components/report-form/report-form';
import {AlertsService, AlertType} from '@app/commons/services/alerts-service';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {UserRole} from '@app/users/models/user-role-enum';
import {HasRole} from '@app/auth/directives/has-role-directive';

@Component({
  selector: 'app-report-details',
  imports: [
    ExamDialog,
    ReportForm,
    HasRole
  ],
  templateUrl: './report-details.html'
})
export class ReportDetails {
  ReportStatus = ReportStatus;

  examsService = inject(ExamsService);
  reportsService = inject(ReportsService);
  alertsService = inject(AlertsService);

  report = input.required<Report>();
  editingExam = signal<Exam | null>(null);
  change = output();

  deleteExam(exam: Exam) {
    if (!exam.id) {
      return;
    }

    this.examsService.delete(exam.id)
      .subscribe({
        next: () => this.change.emit(),
        error: error => this.alertsService.showAlert(error.message, AlertType.ERROR)
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

    this.reportsService.update(updatedReport.id, updatedReport)
      .subscribe({
        next: () => this.change.emit(),
        error: error => this.alertsService.showAlert(error.message, AlertType.ERROR)
      });
  }

  finalizeReport(updatedReport: Report) {
    if (!updatedReport.id) {
      return;
    }

    this.reportsService.finalize(updatedReport.id, updatedReport)
      .subscribe({
        next: () => this.change.emit(),
        error: error => this.alertsService.showAlert(error.message, AlertType.ERROR)
      });
  }

  onDialogConfirm() {
    this.editingExam.set(null);
    this.change.emit();
  }

  protected readonly UserRole = UserRole;
}
