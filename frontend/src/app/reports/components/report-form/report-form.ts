import {Component, computed, effect, inject, input, OnInit, output} from '@angular/core';
import {User} from '@app/users/models/user-model';
import {Report} from '@app/reports/models/report-model';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {UserRole} from '@app/users/models/user-role-enum';
import {HasRole} from '@app/auth/directives/has-role-directive';
import {AuthService} from '@app/auth/services/auth-service';

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

  currentUser = inject(AuthService).user;
  patients = input<User[]>([]);
  report = input<Report>();
  submit = output<Report>();
  finalize = output<Report>();
  canEdit = computed(() => this.report()?.status !== ReportStatus.FINALIZED && this.currentUser()?.role === UserRole.DOCTOR);

  patientFormControl = new FormControl<User | null>(null, Validators.required);
  outcomeFormControl = new FormControl<string | null>(null);

  form = new FormGroup({
    patient: this.patientFormControl,
    outcome: this.outcomeFormControl
  });

  constructor() {
    effect(() => {
      if (this.report()?.status === ReportStatus.FINALIZED || this.currentUser()?.role !== UserRole.DOCTOR) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

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
      ...this.report()!,
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
      ...this.report()!,
      patient: this.patientFormControl.value!,
      outcome: this.outcomeFormControl.value
    });
  }

  isEditing() {
    return !!this.report()?.id;
  }
}
