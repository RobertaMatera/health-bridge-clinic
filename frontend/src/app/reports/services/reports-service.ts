import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Report} from '@app/reports/models/report-model';
import {Exam} from '@app/exams/models/exam-model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  httpClient = inject(HttpClient);

  getAll(): Observable<Report[]> {
    return this.httpClient.get<Report[]>(`${environment.backendUrl}/reports`);
  }

  getByDoctor(doctorID: number): Observable<Report[]> {
    return this.httpClient.get<Report[]>(`${environment.backendUrl}/by-doctor/${doctorID}`);
  }

  getFinalizedByPatient(patientID: number): Observable<Report[]> {
    return this.httpClient.get<Report[]>(`${environment.backendUrl}/finalized/by-patient/${patientID}`);
  }

  create(report: Report): Observable<Report> {
    return this.httpClient.post<Report>(`${environment.backendUrl}/reports`, report);
  }

  // TODO: Replace with right call
  getByID(reportID: number): Observable<Report> {
    return this.getAll().pipe(map((reports => reports.find(r => r.id === reportID) as Report)));
  }

  update(reportID: number, updatedReport: Report): Observable<Report> {
    return this.httpClient.put<Report>(`${environment.backendUrl}/reports/${reportID}`, updatedReport);
  }

  createExam(reportID: number, exam: Exam): Observable<Exam> {
    return this.httpClient.post<Exam>(`${environment.backendUrl}/reports/${reportID}/exams`, exam);
  }
}
