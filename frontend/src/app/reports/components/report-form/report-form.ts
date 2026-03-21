import {Component, input, OnInit, output} from '@angular/core';
import {User} from '@app/users/models/user-model';
import {Report} from '@app/reports/models/report-model';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-report-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './report-form.html'
})
export class ReportForm implements OnInit {
  patients = input<User[]>([]);
  report = input<Report>();
  submit = output<Report>();

  patientFormControl = new FormControl<User | null>(null, Validators.required);
  outcomeFormControl = new FormControl<string | null>(null);

  form = new FormGroup({
    patient: this.patientFormControl,
    outcome: this.outcomeFormControl
  });

  ngOnInit() {
    if (this.report()) {
      this.patientFormControl.setValue(this.report()?.patient ?? null);
      this.outcomeFormControl.setValue(this.report()?.outcome ?? null);
    }
  }

  onSubmitClick(event: PointerEvent) {
    event.preventDefault();

    if (!this.form.valid) {
      return;
    }

    this.submit.emit({
      id: this.report()?.id,
      patient: this.patientFormControl.value!,
      outcome: this.outcomeFormControl.value
    });
  }

  isEditing() {
    return !!this.report()?.id;
  }
}
