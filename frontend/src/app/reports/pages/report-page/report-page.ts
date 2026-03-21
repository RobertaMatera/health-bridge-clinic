import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Report} from '@app/reports/models/report-model';
import {ReportsService} from '@app/reports/services/reports-service';
import {ReportStatusBadge} from '@app/reports/components/report-status-badge/report-status-badge';
import {ReportMetadata} from '@app/reports/components/report-metadata/report-metadata';
import {ReportDetails} from '@app/reports/components/report-details/report-details';

@Component({
  selector: 'app-report-page',
  imports: [
    ReportStatusBadge,
    ReportMetadata,
    ReportDetails
  ],
  templateUrl: './report-page.html'
})
export class ReportPage {
  reportsService = inject(ReportsService);

  reportID = signal<number | null>(null);
  report = signal<Report | undefined>(undefined);

  constructor() {
    const route = inject(ActivatedRoute);
    const reportID = route.snapshot.params['id'];
    this.reportID.set(parseInt(reportID));

    this.loadData();
  }

  loadData() {
    if (this.reportID()) {
      this.reportsService.getByID(this.reportID()!)
        .subscribe(report => this.report.set(report));
    }
  }
}
