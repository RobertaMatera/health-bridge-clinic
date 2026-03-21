import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Exam} from '@app/exams/models/exam-model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {
  httpClient = inject(HttpClient);

  update(exam: Exam): Observable<Exam> {
    return this.httpClient.put<Exam>(`${environment.backendUrl}/exams/${exam.id}`, exam);
  }

  delete(id: number) {
    return this.httpClient.delete(`${environment.backendUrl}/exams/${id}`);
  }
}
