import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {Dialog} from '@app/commons/ui/dialog/dialog';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-confirm-dialog',
  imports: [Dialog, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog [heading]="heading()" [description]="text()" (dismiss)="cancel.emit()">
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" class="btn btn-secondary btn-lg" (click)="cancel.emit()">
          {{ 'common.cancel' | t }}
        </button>
        <button
          type="button"
          class="btn btn-lg"
          [class]="tone() === 'danger' ? 'btn-danger' : 'btn-primary'"
          [disabled]="pending()"
          [attr.aria-busy]="pending() || null"
          (click)="confirm.emit()">
          @if (icon()) {
            <i class="fa-solid {{ icon() }}" aria-hidden="true"></i>
          }
          {{ confirmLabel() }}
        </button>
      </div>
    </app-dialog>
  `
})
export class ConfirmDialog {
  heading = input.required<string>();
  text = input.required<string>();
  confirmLabel = input.required<string>();
  tone = input<'primary' | 'danger'>('primary');
  icon = input<string>();
  pending = input(false);
  confirm = output();
  cancel = output();
}
