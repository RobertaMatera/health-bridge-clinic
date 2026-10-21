import {inject, Pipe, PipeTransform} from '@angular/core';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {TranslationKey, TranslationParams} from '@app/commons/i18n/i18n-types';

/**
 * Impure so it re-evaluates when the language signal changes; the last result is cached
 * so repeated change detection stays cheap.
 */
@Pipe({name: 't', pure: false})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);
  private lastKey?: string;
  private lastValue = '';

  transform(key: TranslationKey, params?: TranslationParams): string {
    const cacheKey = `${this.i18n.language()}|${key}|${params ? JSON.stringify(params) : ''}`;
    if (cacheKey !== this.lastKey) {
      this.lastKey = cacheKey;
      this.lastValue = this.i18n.t(key, params);
    }
    return this.lastValue;
  }
}
