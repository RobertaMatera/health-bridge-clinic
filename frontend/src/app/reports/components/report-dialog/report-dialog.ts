import {Component, inject, OnInit, output, signal} from '@angular/core';
import {ReportForm} from '@app/reports/components/report-form/report-form';
import {User} from '@app/users/models/user-model';
import {UsersService} from '@app/users/services/users-service';
import {Report} from '@app/reports/models/report-model';
import {ReportsService} from '@app/reports/services/reports-service';

@Component({
  selector: 'app-report-dialog',
  imports: [
    ReportForm
  ],
  templateUrl: './report-dialog.html'
})
export class ReportDialog implements OnInit {
  usersService = inject(UsersService);
  reportsService = inject(ReportsService);

  error = signal<string | null>(null);
  confirm = output<Report>();
  dismiss = output();

  patients = signal<User[]>([]);

  ngOnInit() {
    this.usersService.getPatients()
      .subscribe(users => {
        this.patients.set(users);
      });
  }

  onFormSubmit(report: Report) {
    this.reportsService.create(report)
      .subscribe({
        next: createdReport => this.confirm.emit(createdReport),
        error: err => this.error.set(err.message || 'Failed to create report')
      });
  }
}
