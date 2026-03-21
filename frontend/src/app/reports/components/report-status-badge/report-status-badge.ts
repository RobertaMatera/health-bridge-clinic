import {Component, input} from '@angular/core';
import {ReportStatus} from '@app/reports/models/report-status-enum';

@Component({
  selector: 'app-report-status-badge',
  imports: [],
  templateUrl: './report-status-badge.html'
})
export class ReportStatusBadge {
  status = input<ReportStatus>();

  statusClass() {
    switch (this.status()) {
      case ReportStatus.CREATED:
        return 'badge-blue';
      case ReportStatus.IN_PROGRESS:
        return 'badge-green';
      case ReportStatus.FINALIZED:
        return 'badge-red';
      default:
        return 'badge-gray';
    }
  }

  statusLabel(): string {
    switch (this.status()) {
      case ReportStatus.CREATED:
        return 'Creato';
      case ReportStatus.IN_PROGRESS:
        return 'In corso';
      case ReportStatus.FINALIZED:
        return 'Finalizzato';
      default:
        return '';
    }
  }
}
