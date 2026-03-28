import {Component, inject, OnInit, signal} from '@angular/core';
import {AnalyticsService} from '@app/analytics/services/analytics-service';
import {Analytics} from '@app/analytics/models/analytics-model';
import {AlertsService, AlertType} from '@app/commons/services/alerts-service';
import {BaseChartDirective} from 'ng2-charts';
import {ChartData, ChartOptions, ChartType} from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './analytics-page.html'
})
export class AnalyticsPage implements OnInit {
  analyticsService = inject(AnalyticsService);
  alertsService = inject(AlertsService);

  analytics = signal<Analytics | null>(null);
  usersChartData = signal<ChartData<'pie', number[], string | string[]> | undefined>(undefined);
  reportsChartData = signal<ChartData<'pie', number[], string | string[]> | undefined>(undefined);

  ngOnInit() {
    this.analyticsService.getAll()
      .subscribe({
        next: analytics => {
          this.analytics.set(analytics);
          this.usersChartData.set({
            labels: ['Dottori', 'Pazienti'],
            datasets: [
              {
                data: [
                  analytics.totalDoctors,
                  analytics.totalPatients
                ]
              }
            ]
          });
          this.reportsChartData.set({
            labels: ['Creati', 'In corso', 'Finalizzati'],
            datasets: [
              {
                data: [
                  analytics.createdReports,
                  analytics.inProgressReports,
                  analytics.finalizedReports
                ]
              }
            ]
          });
        },
        error: error => this.alertsService.showAlert(error.message, AlertType.ERROR)
      });
  }
}
