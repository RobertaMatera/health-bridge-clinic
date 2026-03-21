import {computed, inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {User} from '@app/users/models/user-model';
import {map, Observable} from 'rxjs';
import {UserRole} from '@app/users/models/user-role-enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  httpClient = inject(HttpClient);

  isLoggedIn = signal<boolean>(false);
  isPatient = signal<boolean>(false);
  isDoctor = signal<boolean>(false);
  user = signal<User | null>(null);

  constructor() {
    this.updateStatus();
  }

  private updateStatus(): void {
    this.isLoggedIn.set(this.credentialsExist());

    const role = this.getUser()?.role;
    this.isPatient.set(role === UserRole.PATIENT);
    this.isDoctor.set(role === UserRole.DOCTOR);
    this.user.set(this.getUser());
  }

  private credentialsExist(): boolean {
    if (localStorage.getItem('user') && localStorage.getItem('password')) {
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('password');

    this.updateStatus();
    this.router.navigate(['login']);
  }

  login(email: string, password: string) {
    return this.validateCredentials(email, password)
      .pipe(map(user => {
        console.log('Valid user', user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('password', password);

        this.updateStatus();
        this.router.navigate(['/']);

        return user;
      }));
  }

  private validateCredentials(email: string, password: string): Observable<User> {
    return this.httpClient.post(`${environment.backendUrl}/auth/login`, {email, password}) as Observable<User>;
  }

  getUser(): User | null {
    const json = localStorage.getItem('user');

    if (!json) {
      return null;
    }

    return JSON.parse(json);
  }

  token = computed(() => {
    const email = this.user()?.email;
    const password = localStorage.getItem('password');

    if (!email || !password) {
      return null;
    }

    return btoa(`${email}:${password}`);
  });

  hasRole(role: UserRole) {
    return this.getUser()?.role === role;
  }
}
