import {Component, inject, input, output, signal} from '@angular/core';
import {Exam} from '@app/exams/models/exam-model';
import {ExamForm} from '@app/exams/components/exam-form/exam-form';
import {ExamsService} from '@app/exams/services/exams-service';
import {ReportsService} from '@app/reports/services/reports-service';
import {Report} from '@app/reports/models/report-model';

@Component({
  selector: 'app-exam-dialog',
  imports: [
    ExamForm
  ],
  templateUrl: './exam-dialog.html'
})
export class ExamDialog {
  examsService = inject(ExamsService);
  reportsService = inject(ReportsService);

  report = input.required<Report>();
  exam = input.required<Exam>();
  confirm = output<Exam>();
  dismiss = output();

  error = signal<string | null>(null);

  onFormSubmit(examFromForm: Exam) {
    if (!!examFromForm.id) {
      this.examsService.update(examFromForm)
        .subscribe({
          next: updatedExam => {
            this.confirm.emit(updatedExam);
          },
          error: error => this.error.set(error.message)
        });
    } else {
      this.reportsService.createExam(this.report().id!, examFromForm)
        .subscribe({
          next: () => {
            this.confirm.emit(examFromForm);
          },
          error: error => this.error.set(error.message)
        });
    }
  }
}
