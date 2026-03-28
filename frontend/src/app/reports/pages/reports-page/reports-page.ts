import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {ReportsService} from '@app/reports/services/reports-service';
import {Report} from '@app/reports/models/report-model';
import {RouterLink} from '@angular/router';
import {UserBadge} from '@app/users/components/user-badge/user-badge';
import {ReportStatusBadge} from '@app/reports/components/report-status-badge/report-status-badge';
import {finalize, Observable} from 'rxjs';
import {AuthService} from '@app/auth/services/auth-service';
import {UserRole} from '@app/users/models/user-role-enum';
import {ReportDialog} from '@app/reports/components/report-dialog/report-dialog';
import {HasRole} from '@app/auth/directives/has-role-directive';
import {ReportStatus} from '@app/reports/models/report-status-enum';

@Component({
  selector: 'app-reports-page',
  imports: [RouterLink, UserBadge, ReportStatusBadge, ReportDialog, HasRole],
  templateUrl: './reports-page.html'
})
export class ReportsPage implements OnInit {
  UserRole = UserRole;
  ReportStatus = ReportStatus;

  reportsService = inject(ReportsService);
  authService = inject(AuthService);

  loading = signal<boolean>(false);
  showCreateDialog = signal<boolean>(false);
  reports = signal<Report[]>([]);
  requestType = signal<'ALL' | ReportStatus>('ALL');

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const user = this.authService.user();

    if (!user || !user.id) {
      return;
    }

    this.loading.set(true);
    this.request()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(reports => this.reports.set(reports));
  }

  onReportDialogConfirm(report: Report) {
    this.showCreateDialog.set(false);
    this.loadData();
  }

  request(): Observable<Report[]> {
    if (this.requestType() === 'ALL') {
      return this.reportsService.getAll();
    } else {
      return this.reportsService.getByStatus(this.requestType() as ReportStatus);
    }
  }

  setRequestType(type: 'ALL' | ReportStatus) {
    this.requestType.set(type);
    this.loadData();
  }
}
