import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {Exam} from '@app/exams/models/exam-model';
import {ExamFlag} from '@app/exams/components/exam-flag/exam-flag';
import {RangeIndicator} from '@app/exams/components/range-indicator/range-indicator';
import {ExamRangePipe} from '@app/exams/pipes/exam-range-pipe';
import {LocalNumberPipe} from '@app/commons/i18n/local-number-pipe';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

/** Exams as a table from md up and as stacked rows below; edit/delete only when editable. */
@Component({
  selector: 'app-exams-table',
  imports: [ExamFlag, RangeIndicator, ExamRangePipe, LocalNumberPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exams-table.html'
})
export class ExamsTable {
  exams = input.required<Exam[]>();
  editable = input(false);
  edit = output<Exam>();
  remove = output<Exam>();
}
