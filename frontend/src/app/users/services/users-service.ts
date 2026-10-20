import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '@app/users/models/user-model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly httpClient = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.backendUrl}/users`);
  }

  getPatients(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.backendUrl}/users/patients`);
  }
}
