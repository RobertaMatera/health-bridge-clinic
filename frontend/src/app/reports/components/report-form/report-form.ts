import {Component, input, OnInit, output} from '@angular/core';
import {User} from '@app/users/models/user-model';
import {Report} from '@app/reports/models/report-model';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {UserRole} from '@app/users/models/user-role-enum';
import {HasRole, HasRoleAction} from '@app/auth/directives/has-role-directive';

@Component({
  selector: 'app-report-form',
  imports: [
    ReactiveFormsModule,
    HasRole
  ],
  templateUrl: './report-form.html'
})
export class ReportForm implements OnInit {
  UserRole = UserRole;
  HasRoleAction = HasRoleAction;
  ReportStatus = ReportStatus;

  patients = input<User[]>([]);
  report = input<Report>();
  submit = output<Report>();
  finalize = output<Report>();

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
      this.outcomeFormControl.setValidators([Validators.required]);
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

  onFinalizeClick(event: PointerEvent) {
    event.preventDefault();

    if (!this.form.valid) {
      return;
    }

    this.finalize.emit({
      id: this.report()?.id,
      patient: this.patientFormControl.value!,
      outcome: this.outcomeFormControl.value
    });
  }

  isEditing() {
    return !!this.report()?.id;
  }
}
