import {ErrorHandler, inject, Injectable, signal} from '@angular/core';
import {TranslationKey, TranslationParams} from '@app/commons/i18n/i18n-types';
import {errorMessageKey} from '@app/commons/errors/error-message';

export type ToastKind = 'success' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  key: TranslationKey;
  params?: TranslationParams;
}

const SUCCESS_TIMEOUT_MS = 5000;

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly errorHandler = inject(ErrorHandler);
  private nextId = 0;

  readonly toasts = signal<Toast[]>([]);

  success(key: TranslationKey, params?: TranslationParams): void {
    const id = this.push('success', key, params);
    setTimeout(() => this.dismiss(id), SUCCESS_TIMEOUT_MS);
  }

  // Errors stay until dismissed so nobody is timed out of reading them (WCAG 2.2.1).
  error(key: TranslationKey, params?: TranslationParams): void {
    this.push('error', key, params);
  }

  /** Shows the translated message for an HTTP failure. */
  httpError(error: unknown): void {
    if (errorMessageKey(error) === 'errors.UNKNOWN') {
      this.errorHandler.handleError(error);
    }
    this.error(errorMessageKey(error));
  }

  dismiss(id: number): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  private push(kind: ToastKind, key: TranslationKey, params?: TranslationParams): number {
    const id = ++this.nextId;
    // Identical messages replace each other instead of stacking.
    this.toasts.update(toasts => [...toasts.filter(toast => toast.key !== key), {id, kind, key, params}]);
    return id;
  }
}
