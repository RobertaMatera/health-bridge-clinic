import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, output, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs';
import {UsersService} from '@app/users/services/users-service';
import {User} from '@app/users/models/user-model';
import {ReportsService} from '@app/reports/services/reports-service';
import {Report} from '@app/reports/models/report-model';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {TranslationKey} from '@app/commons/i18n/i18n-types';
import {errorMessageKey} from '@app/commons/errors/error-message';

@Component({
  selector: 'app-new-report-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form novalidate class="flex flex-col gap-5" (ngSubmit)="submit()">
      @if (serverError(); as error) {
        <div class="alert-error" role="alert">
          <i class="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true"></i>
          <span>{{ error | t }}</span>
        </div>
      }

      <div>
        <label class="label" for="new-report-patient">{{ 'reports.create.patient' | t }}</label>
        <select
          id="new-report-patient"
          class="input"
          autofocus
          [formControl]="patientId"
          [attr.aria-invalid]="showError() ? true : null"
          [attr.aria-describedby]="showError() ? 'new-report-patient-error new-report-hint' : 'new-report-hint'">
          <option [ngValue]="null" disabled>{{ (loadingPatients() ? 'common.loading' : 'reports.create.patientPlaceholder') | t }}</option>
          @for (patient of sortedPatients(); track patient.id) {
            <option [ngValue]="patient.id">{{ patient.lastName }} {{ patient.firstName }} · {{ patient.email }}</option>
          }
        </select>
        @if (showError()) {
          <p id="new-report-patient-error" class="field-error">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>{{ 'validation.required' | t }}
          </p>
        }
        <p id="new-report-hint" class="field-hint">{{ 'reports.create.hint' | t }}</p>
      </div>

      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" class="btn btn-secondary btn-lg" (click)="cancel.emit()">{{ 'common.cancel' | t }}</button>
        <button type="submit" class="btn btn-primary btn-lg" [disabled]="submitting()" [attr.aria-busy]="submitting() || null">
          <i class="fa-solid fa-plus" aria-hidden="true"></i>{{ 'reports.create.submit' | t }}
        </button>
      </div>
    </form>
  `
})
export class NewReportForm {
  private readonly reportsService = inject(ReportsService);

  created = output<Report>();
  cancel = output();

  protected readonly patientId = new FormControl<number | null>(null, Validators.required);
  protected readonly patients = signal<User[]>([]);
  protected readonly loadingPatients = signal(true);
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly serverError = signal<TranslationKey | null>(null);

  protected readonly sortedPatients = computed(() =>
    [...this.patients()].sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)));

  constructor() {
    inject(UsersService).getPatients()
      .pipe(finalize(() => this.loadingPatients.set(false)), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe({
        next: patients => this.patients.set(patients),
        error: error => this.serverError.set(errorMessageKey(error))
      });
  }

  protected showError(): boolean {
    return this.submitted() && this.patientId.invalid;
  }

  protected submit(): void {
    this.submitted.set(true);
    const patient = this.patients().find(candidate => candidate.id === this.patientId.value);
    if (!patient) {
      return;
    }

    this.submitting.set(true);
    this.serverError.set(null);
    this.reportsService.create({patient: {email: patient.email}})
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: report => this.created.emit(report),
        error: error => this.serverError.set(errorMessageKey(error))
      });
  }
}
