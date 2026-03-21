import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Analytics} from '@app/analytics/models/analytics-model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  getAll(): Observable<Analytics> {
    return of({
      createdReports: 123,
      inProgressReports: 23,
      finalizedReports: 89,
      averageMinutesInProgress: 463
    });
  }
}
