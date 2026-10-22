import {ChangeDetectionStrategy, Component, DOCUMENT, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs';
import {AuthService} from '@app/auth/services/auth-service';
import {DEMO_ACCOUNTS, DemoAccount} from '@app/auth/models/demo-accounts';
import {Logo} from '@app/commons/components/logo/logo';
import {LanguageSwitcher} from '@app/commons/components/language-switcher/language-switcher';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {TranslationKey} from '@app/commons/i18n/i18n-types';
import {errorMessageKey} from '@app/commons/errors/error-message';
import {environment} from '@environments/environment';
import {roleKey} from '@app/users/models/user-name';
import {UserRole} from '@app/users/models/user-role-enum';
import {DEMO_MODE} from '@app/demo/demo-mode';

@Component({
  selector: 'app-login-page',
  imports: [Logo, LanguageSwitcher, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-page.html'
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly document = inject(DOCUMENT);
  private readonly demoMode = inject(DEMO_MODE);

  protected readonly demoAccounts = this.demoMode?.accounts ?? (environment.showDemoAccounts ? DEMO_ACCOUNTS : []);
  // Browser-only demo: one button per role, and the form starts filled in with the doctor.
  protected readonly quickLogins = this.demoMode
    ? [UserRole.DOCTOR, UserRole.PATIENT].map(role => this.demoAccounts.find(account => account.role === role)!)
    : [];
  private readonly prefill = this.quickLogins[0];

  protected readonly form = new FormGroup({
    email: new FormControl(this.prefill?.email ?? '', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl(this.prefill?.password ?? '', {nonNullable: true, validators: [Validators.required]}),
    remember: new FormControl(false, {nonNullable: true})
  });

  protected readonly showPassword = signal(false);
  protected readonly showForgotInfo = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly serverError = signal<TranslationKey | null>(null);
  protected readonly quickLoginRole = signal<UserRole | null>(null);

  protected readonly roleKey = roleKey;
  protected readonly isDemo = this.demoMode !== null;

  protected readonly features = [
    {icon: 'fa-file-lines', title: 'auth.brand.feature1Title', text: 'auth.brand.feature1Text'},
    {icon: 'fa-lock', title: 'auth.brand.feature2Title', text: 'auth.brand.feature2Text'},
    {icon: 'fa-circle-check', title: 'auth.brand.feature3Title', text: 'auth.brand.feature3Text'}
  ] as const satisfies readonly {icon: string; title: TranslationKey; text: TranslationKey}[];

  protected emailError(): TranslationKey | null {
    const control = this.form.controls.email;
    if (!this.shouldShowError(control)) {
      return null;
    }
    return control.hasError('required') ? 'validation.required' : 'validation.email';
  }

  protected passwordError(): TranslationKey | null {
    return this.shouldShowError(this.form.controls.password) ? 'validation.required' : null;
  }

  protected fillDemo(account: DemoAccount): void {
    this.form.patchValue({email: account.email, password: account.password});
    this.serverError.set(null);
    this.document.getElementById('login-submit')?.focus();
  }

  protected quickLogin(account: DemoAccount): void {
    this.form.patchValue({email: account.email, password: account.password});
    this.quickLoginRole.set(account.role);
    this.submit();
  }

  protected quickLoginKey(role: UserRole): TranslationKey {
    return role === UserRole.DOCTOR ? 'auth.demo.asDoctor' : 'auth.demo.asPatient';
  }

  protected submit(): void {
    this.submitted.set(true);
    this.serverError.set(null);

    if (this.form.invalid) {
      // Move focus to the first field that needs attention.
      const firstInvalid = this.form.controls.email.invalid ? 'email' : 'password';
      this.document.getElementById(firstInvalid)?.focus();
      return;
    }

    const {email, password, remember} = this.form.getRawValue();
    this.submitting.set(true);
    this.authService.login(email.trim(), password, remember)
      .pipe(finalize(() => {
        this.submitting.set(false);
        this.quickLoginRole.set(null);
      }))
      .subscribe({
        error: error => this.serverError.set(errorMessageKey(error))
      });
  }

  private shouldShowError(control: FormControl<string>): boolean {
    return control.invalid && (control.touched || this.submitted());
  }
}
