import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {Exam} from '@app/exams/models/exam-model';
import {evaluateExam, flagClass, flagKey} from '@app/exams/models/exam-range';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-exam-flag',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="flag" [class]="cssClass()">{{ labelKey() | t }}</span>`
})
export class ExamFlag {
  exam = input.required<Pick<Exam, 'examValue' | 'refMin' | 'refMax'>>();

  private readonly flag = computed(() => evaluateExam(this.exam()));
  protected readonly cssClass = computed(() => flagClass(this.flag()));
  protected readonly labelKey = computed(() => flagKey(this.flag()));
}
