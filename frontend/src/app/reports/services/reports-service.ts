import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NewReport, Report, ReportChanges} from '@app/reports/models/report-model';
import {Exam} from '@app/exams/models/exam-model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {ReportStatus} from '@app/reports/models/report-status-enum';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly httpClient = inject(HttpClient);

  getAll(): Observable<Report[]> {
    return this.httpClient.get<Report[]>(`${environment.backendUrl}/reports`);
  }

  create(report: NewReport): Observable<Report> {
    return this.httpClient.post<Report>(`${environment.backendUrl}/reports`, report);
  }

  getByID(reportID: number): Observable<Report> {
    return this.httpClient.get<Report>(`${environment.backendUrl}/reports/${reportID}`);
  }

  update(reportID: number, changes: ReportChanges): Observable<Report> {
    return this.httpClient.put<Report>(`${environment.backendUrl}/reports/${reportID}`, changes);
  }

  finalize(reportID: number, changes: ReportChanges): Observable<Report> {
    return this.httpClient.put<Report>(`${environment.backendUrl}/reports/${reportID}/finalize`, changes);
  }

  // The API answers with the whole updated report.
  createExam(reportID: number, exam: Exam): Observable<Report> {
    return this.httpClient.post<Report>(`${environment.backendUrl}/reports/${reportID}/exams`, exam);
  }

  getByStatus(status: ReportStatus): Observable<Report[]> {
    return this.httpClient.get<Report[]>(`${environment.backendUrl}/reports/by-status/${status}`);
  }
}
