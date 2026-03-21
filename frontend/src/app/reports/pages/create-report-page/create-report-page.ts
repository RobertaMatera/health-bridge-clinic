import {Component, inject, OnInit, signal} from '@angular/core';
import {ReportForm} from '@app/reports/components/report-form/report-form';
import {UsersService} from '@app/users/services/users-service';
import {User} from '@app/users/models/user-model';
import {ReportsService} from '@app/reports/services/reports-service';
import {Report} from '@app/reports/models/report-model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-report-page',
  imports: [
    ReportForm
  ],
  templateUrl: './create-report-page.html'
})
export class CreateReportPage implements OnInit {
  reportsService = inject(ReportsService);
  usersService = inject(UsersService);
  router = inject(Router);

  patients = signal<User[]>([]);

  ngOnInit() {
    this.usersService.getPatients().subscribe(users => {
      console.log(users);
      this.patients.set(users)
    });
  }

   onReportFormSubmit(report: Report) {
    this.reportsService.create(report).subscribe(() => {
      this.router.navigate(['/reports']);
    });
  }
}
