import {ChangeDetectionStrategy, Component, computed, DOCUMENT, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from '@app/auth/services/auth-service';
import {UserRole} from '@app/users/models/user-role-enum';
import {DoctorShell} from '@app/commons/layout/doctor-shell/doctor-shell';
import {PatientShell} from '@app/commons/layout/patient-shell/patient-shell';
import {ToastOutlet} from '@app/commons/ui/toast/toast-outlet';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DoctorShell, PatientShell, ToastOutlet, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly document = inject(DOCUMENT);

  protected readonly layout = computed(() => {
    switch (this.authService.user()?.role) {
      case UserRole.DOCTOR:
        return 'doctor';
      case UserRole.PATIENT:
        return 'patient';
      default:
        return 'public';
    }
  });

  // A plain href="#main" would be treated as a navigation because of <base href="/">.
  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main')?.focus();
  }
}
