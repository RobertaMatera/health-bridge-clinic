import {inject, Pipe, PipeTransform} from '@angular/core';
import {I18nService} from '@app/commons/i18n/i18n-service';

/** Locale-aware number (decimal comma in Italian), up to two decimals by default. */
@Pipe({name: 'localNumber', pure: false})
export class LocalNumberPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(value: number | null | undefined, maximumFractionDigits = 2): string {
    return this.i18n.formatNumber(value, {maximumFractionDigits});
  }
}
