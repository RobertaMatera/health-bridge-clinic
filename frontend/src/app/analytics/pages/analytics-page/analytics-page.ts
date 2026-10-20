import {Component, inject, OnInit, signal} from '@angular/core';
import {AnalyticsService} from '@app/analytics/services/analytics-service';
import {Analytics} from '@app/analytics/models/analytics-model';
import {ToastService} from '@app/commons/ui/toast/toast-service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.html'
})
export class AnalyticsPage implements OnInit {
  analyticsService = inject(AnalyticsService);
  toastService = inject(ToastService);

  analytics = signal<Analytics | null>(null);

  ngOnInit() {
    this.analyticsService.getAll()
      .subscribe({
        next: analytics => this.analytics.set(analytics),
        error: error => this.toastService.httpError(error)
      });
  }
}
