import {Component, input} from '@angular/core';
import {Report} from '@app/reports/models/report-model';
import {DatePipe} from '@angular/common';
import {UserBadge} from '@app/users/components/user-badge/user-badge';

@Component({
  selector: 'app-report-metadata',
  imports: [
    DatePipe,
    UserBadge
  ],
  templateUrl: './report-metadata.html'
})
export class ReportMetadata {
  report = input.required<Report>();

}
