import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {ReportsService} from '@app/reports/services/reports-service';
import {Report} from '@app/reports/models/report-model';
import {AuthService} from '@app/auth/services/auth-service';
import {DoctorReports} from '@app/reports/components/doctor-reports/doctor-reports';
import {ReportStatusBadge} from '@app/reports/components/report-status-badge/report-status-badge';

@Component({
  selector: 'app-reports-page',
  imports: [RouterLink, ReportStatusBadge, DoctorReports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reports-page.html'
})
export class ReportsPage {
  protected readonly authService = inject(AuthService);
  protected readonly reports = signal<Report[]>([]);

  constructor() {
    if (!this.authService.isDoctor()) {
      inject(ReportsService).getAll()
        .pipe(takeUntilDestroyed(inject(DestroyRef)))
        .subscribe(reports => this.reports.set(reports));
    }
  }
}
