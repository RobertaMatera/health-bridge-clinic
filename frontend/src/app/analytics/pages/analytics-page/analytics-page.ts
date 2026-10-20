import {Component, inject, OnInit, signal} from '@angular/core';
import {AnalyticsService} from '@app/analytics/services/analytics-service';
import {Analytics} from '@app/analytics/models/analytics-model';
import {AlertsService, AlertType} from '@app/commons/services/alerts-service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.html'
})
export class AnalyticsPage implements OnInit {
  analyticsService = inject(AnalyticsService);
  alertsService = inject(AlertsService);

  analytics = signal<Analytics | null>(null);

  ngOnInit() {
    this.analyticsService.getAll()
      .subscribe({
        next: analytics => this.analytics.set(analytics),
        error: error => this.alertsService.showAlert(error.message, AlertType.ERROR)
      });
  }
}
