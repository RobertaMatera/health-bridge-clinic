import {ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {finalize, Observable} from 'rxjs';
import {Exam} from '@app/exams/models/exam-model';
import {ExamsService} from '@app/exams/services/exams-service';
import {ReportsService} from '@app/reports/services/reports-service';
import {Dialog} from '@app/commons/ui/dialog/dialog';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {TranslationKey} from '@app/commons/i18n/i18n-types';
import {errorMessageKey} from '@app/commons/errors/error-message';

const ANALYSIS_MAX = 120;
const UNIT_MAX = 30;

function rangeOrder(group: AbstractControl): ValidationErrors | null {
  const {refMin, refMax} = group.value as {refMin: number | null; refMax: number | null};
  return refMin !== null && refMax !== null && refMin > refMax ? {rangeOrder: true} : null;
}

/** Create or edit an exam. `exam` null means a new exam for `reportId`. */
@Component({
  selector: 'app-exam-dialog',
  imports: [Dialog, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exam-dialog.html'
})
export class ExamDialog implements OnInit {
  private readonly examsService = inject(ExamsService);
  private readonly reportsService = inject(ReportsService);
  private readonly i18n = inject(I18nService);

  reportId = input.required<number>();
  exam = input<Exam | null>(null);
  saved = output();
  dismiss = output();

  protected readonly form = new FormGroup({
    analysis: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.maxLength(ANALYSIS_MAX)]}),
    unitOfMeasure: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.maxLength(UNIT_MAX)]}),
    examValue: new FormControl<number | null>(null, Validators.required),
    refMin: new FormControl<number | null>(null),
    refMax: new FormControl<number | null>(null)
  }, {validators: rangeOrder});

  protected readonly submitted = signal(false);
  protected readonly saving = signal(false);
  protected readonly serverError = signal<TranslationKey | null>(null);
  protected readonly heading = computed(() => this.i18n.t(this.exam() ? 'reports.examForm.titleEdit' : 'reports.examForm.titleNew'));

  ngOnInit(): void {
    const exam = this.exam();
    if (exam) {
      this.form.setValue({
        analysis: exam.analysis,
        unitOfMeasure: exam.unitOfMeasure,
        examValue: exam.examValue,
        refMin: exam.refMin ?? null,
        refMax: exam.refMax ?? null
      });
    }
  }

  protected fieldError(name: 'analysis' | 'unitOfMeasure' | 'examValue'): TranslationKey | null {
    const control = this.form.controls[name];
    if (!control.invalid || !(control.touched || this.submitted())) {
      return null;
    }
    if (control.hasError('required')) {
      return 'validation.required';
    }
    return control.hasError('maxLength') || control.hasError('maxlength') ? 'validation.maxLength' : 'validation.number';
  }

  protected maxLength(name: 'analysis' | 'unitOfMeasure'): number {
    return name === 'analysis' ? ANALYSIS_MAX : UNIT_MAX;
  }

  protected rangeError(): boolean {
    return this.form.hasError('rangeOrder') && (this.submitted() || this.form.controls.refMin.touched || this.form.controls.refMax.touched);
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const payload: Exam = {
      id: this.exam()?.id,
      analysis: value.analysis.trim(),
      unitOfMeasure: value.unitOfMeasure.trim(),
      examValue: value.examValue!,
      refMin: value.refMin,
      refMax: value.refMax
    };
    const request: Observable<unknown> = payload.id
      ? this.examsService.update(payload)
      : this.reportsService.createExam(this.reportId(), payload);

    this.saving.set(true);
    this.serverError.set(null);
    request
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.saved.emit(),
        error: error => this.serverError.set(errorMessageKey(error))
      });
  }
}
