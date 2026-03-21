import {Component, input, OnInit, output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Exam} from '@app/exams/models/exam-model';

@Component({
  selector: 'app-exam-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './exam-form.html'
})
export class ExamForm implements OnInit {
  exam = input.required<Exam>();
  submit = output<Exam>();

  analysisFormControl = new FormControl<string | null>(null, {
    validators: Validators.required
  });
  unitOfMeasureFormControl = new FormControl<string | null>(null, {
    validators: Validators.required
  });
  examValueFormControl = new FormControl<number>(0.0, {
    validators: Validators.required
  });

  form = new FormGroup({
    analysis: this.analysisFormControl,
    unitOfMeasure: this.unitOfMeasureFormControl,
    examValue: this.examValueFormControl
  });

  ngOnInit() {
    this.form.setValue({
      analysis: this.exam().analysis,
      unitOfMeasure: this.exam().unitOfMeasure,
      examValue: this.exam().examValue
    });
  }

  onSubmitClick(event: PointerEvent) {
    event.preventDefault();

    if (!this.form.valid) {
      return;
    }

    const updatedExam: Exam = {
      id: this.exam().id,
      analysis: this.analysisFormControl.value!,
      unitOfMeasure: this.unitOfMeasureFormControl.value!,
      examValue: this.examValueFormControl.value!
    };

    this.submit.emit(updatedExam);
  }
}
