import {Component, inject, signal} from '@angular/core';
import {AuthService} from '@app/auth/services/auth-service';
import {Logo} from '@app/commons/components/logo/logo';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-page',
  imports: [
    Logo,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html'
})
export class LoginPage {
  authService = inject(AuthService);

  emailFormControl = new FormControl<string>('', {validators: [Validators.email]});
  passwordFormControl = new FormControl('', {validators: [Validators.required]});

  loginForm = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });

  errorMessage = signal<string | null>(null);

  login(event: Event) {
    event.preventDefault();

    if (!this.loginForm.valid) {
      return;
    }

    this.errorMessage.set(null);

    this.authService.login(this.emailFormControl.value!, this.passwordFormControl.value!)
      .subscribe({
        next: () => {
        },
        error: error => {
          console.debug('Login error', error);
          this.errorMessage.set('Login failed. Please check your email and password and try again.');
        }
      });
  }
}
