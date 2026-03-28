import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Report} from '@app/reports/models/report-model';
import {Exam} from '@app/exams/models/exam-model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {ReportStatus} from '@app/reports/models/report-status-enum';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  httpClient = inject(HttpClient);

  getAll(): Observable<Report[]> {
    return this.httpClient.get<Report[]>(`${environment.backendUrl}/reports`);
  }

  create(report: Report): Observable<Report> {
    return this.httpClient.post<Report>(`${environment.backendUrl}/reports`, report);
  }

  getByID(reportID: number): Observable<Report> {
    return this.httpClient.get<Report>(`${environment.backendUrl}/reports/${reportID}`);
  }

  update(reportID: number, updatedReport: Report): Observable<Report> {
    return this.httpClient.put<Report>(`${environment.backendUrl}/reports/${reportID}`, updatedReport);
  }

  finalize(reportID: number, updatedReport: Report): Observable<Report> {
    return this.httpClient.put<Report>(`${environment.backendUrl}/reports/${reportID}/finalize`, updatedReport);
  }

  createExam(reportID: number, exam: Exam): Observable<Exam> {
    return this.httpClient.post<Exam>(`${environment.backendUrl}/reports/${reportID}/exams`, exam);
  }

  getByStatus(status: ReportStatus): Observable<Report[]> {
    return this.httpClient.get<Report[]>(`${environment.backendUrl}/reports/by-status/${status}`);
  }
}
