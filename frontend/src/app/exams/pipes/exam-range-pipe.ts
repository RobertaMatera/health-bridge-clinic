import {inject, Pipe, PipeTransform} from '@angular/core';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {Exam} from '@app/exams/models/exam-model';
import {formatRange} from '@app/exams/models/exam-range';

/** Reference range of an exam formatted for the current language, e.g. "13–17" or "< 200". */
@Pipe({name: 'examRange', pure: false})
export class ExamRangePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(exam: Pick<Exam, 'refMin' | 'refMax'>): string {
    return formatRange(exam, value => this.i18n.formatNumber(value, {maximumFractionDigits: 2}));
  }
}
