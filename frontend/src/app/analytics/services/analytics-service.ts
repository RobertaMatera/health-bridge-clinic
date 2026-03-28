import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Analytics} from '@app/analytics/models/analytics-model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  httpClient = inject(HttpClient);

  getAll(): Observable<Analytics> {
    return this.httpClient.get<Analytics>(`${environment.backendUrl}/analytics`);
  }
}
