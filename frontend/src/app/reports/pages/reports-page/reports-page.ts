import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AuthService} from '@app/auth/services/auth-service';
import {DoctorReports} from '@app/reports/components/doctor-reports/doctor-reports';
import {PatientReports} from '@app/patient/components/patient-reports/patient-reports';

/** /reports: the doctor's worklist or the patient's own reports, depending on the role. */
@Component({
  selector: 'app-reports-page',
  imports: [DoctorReports, PatientReports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (authService.isDoctor()) {
      <app-doctor-reports/>
    } @else {
      <app-patient-reports/>
    }
  `
})
export class ReportsPage {
  protected readonly authService = inject(AuthService);
}
