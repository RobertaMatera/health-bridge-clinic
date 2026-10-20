import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {Dialog} from '@app/commons/ui/dialog/dialog';
import {NewReportForm} from '@app/reports/components/new-report-form/new-report-form';
import {Report} from '@app/reports/models/report-model';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-new-report-dialog',
  imports: [Dialog, NewReportForm, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog [heading]="'reports.create.title' | t" (dismiss)="dismiss.emit()">
      <app-new-report-form (created)="created.emit($event)" (cancel)="dismiss.emit()"/>
    </app-dialog>
  `
})
export class NewReportDialog {
  created = output<Report>();
  dismiss = output();
}
