import {Component, inject, OnInit, signal} from '@angular/core';
import {AnalyticsService} from '@app/analytics/services/analytics-service';
import {Analytics} from '@app/analytics/models/analytics-model';

@Component({
  selector: 'app-analytics-page',
  imports: [],
  templateUrl: './analytics-page.html'
})
export class AnalyticsPage implements OnInit {
  analyticsService = inject(AnalyticsService);

  analytics = signal<Analytics | null>(null);

  ngOnInit() {
    this.analyticsService.getAll().subscribe(analytics => this.analytics.set(analytics));
  }
}
