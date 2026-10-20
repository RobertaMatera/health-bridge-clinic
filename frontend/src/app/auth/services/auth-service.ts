import {computed, inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {User} from '@app/users/models/user-model';
import {Observable, tap} from 'rxjs';
import {UserRole} from '@app/users/models/user-role-enum';

const USER_KEY = 'user';
const PASSWORD_KEY = 'password';

interface StoredSession {
  user: User;
  password: string;
}

/**
 * HTTP Basic credentials are kept for the session only, unless the user ticks
 * "Remember me", in which case they survive closing the browser (localStorage).
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly httpClient = inject(HttpClient);

  private readonly session = signal<StoredSession | null>(readSession());

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);
  readonly isDoctor = computed(() => this.user()?.role === UserRole.DOCTOR);
  readonly isPatient = computed(() => this.user()?.role === UserRole.PATIENT);

  readonly token = computed(() => {
    const session = this.session();
    return session ? btoa(`${session.user.email}:${session.password}`) : null;
  });

  login(email: string, password: string, remember: boolean): Observable<User> {
    return this.httpClient.post<User>(`${environment.backendUrl}/auth/login`, {email, password})
      .pipe(tap(user => {
        clearSession();
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(USER_KEY, JSON.stringify(user));
        storage.setItem(PASSWORD_KEY, password);
        this.session.set({user, password});
        this.router.navigate(['/']);
      }));
  }

  logout(): void {
    clearSession();
    this.session.set(null);
    this.router.navigate(['login']);
  }

  hasRole(role: UserRole): boolean {
    return this.user()?.role === role;
  }
}

function readSession(): StoredSession | null {
  for (const storage of [sessionStorage, localStorage]) {
    try {
      const user = storage.getItem(USER_KEY);
      const password = storage.getItem(PASSWORD_KEY);
      if (user && password) {
        return {user: JSON.parse(user) as User, password};
      }
    } catch {
      // Unreadable or corrupt storage counts as signed out.
    }
  }
  return null;
}

function clearSession(): void {
  for (const storage of [sessionStorage, localStorage]) {
    storage.removeItem(USER_KEY);
    storage.removeItem(PASSWORD_KEY);
  }
}
