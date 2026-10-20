import {HttpErrorResponse} from '@angular/common/http';
import {TranslationKey} from '@app/commons/i18n/i18n-types';
import {en} from '@app/commons/i18n/dictionaries/en';

type ErrorKey = keyof typeof en.errors;

/** Shape of the backend's error body (see GlobalExceptionHandler). */
export interface ApiError {
  status: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

export function apiErrorCode(error: unknown): string | null {
  if (error instanceof HttpErrorResponse && error.error && typeof error.error === 'object' && 'code' in error.error) {
    return (error.error as ApiError).code;
  }
  return null;
}

/** Maps any HTTP failure to a translated, user-facing message key. */
export function errorMessageKey(error: unknown): TranslationKey {
  if (error instanceof HttpErrorResponse && error.status === 0) {
    return 'errors.NETWORK';
  }
  const code = apiErrorCode(error);
  if (code && code in en.errors) {
    return `errors.${code as ErrorKey}`;
  }
  return 'errors.UNKNOWN';
}
