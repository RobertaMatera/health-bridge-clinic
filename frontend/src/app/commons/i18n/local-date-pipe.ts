import {inject, Pipe, PipeTransform} from '@angular/core';
import {DateStyle, I18nService} from '@app/commons/i18n/i18n-service';

/** Formats a date with Intl for the current language (it-IT / en-GB). */
@Pipe({name: 'localDate', pure: false})
export class LocalDatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);
  private lastKey?: string;
  private lastValue = '';

  transform(value: Date | string | null | undefined, style: DateStyle = 'date'): string {
    const cacheKey = `${this.i18n.language()}|${style}|${value instanceof Date ? value.toISOString() : value}`;
    if (cacheKey !== this.lastKey) {
      this.lastKey = cacheKey;
      this.lastValue = this.i18n.formatDate(value, style);
    }
    return this.lastValue;
  }
}
