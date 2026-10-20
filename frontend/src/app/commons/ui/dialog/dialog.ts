import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild
} from '@angular/core';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

let nextId = 0;

/**
 * Modal dialog on top of the native <dialog>: showModal() gives focus trapping, an inert
 * background and Esc handling. Render it with @if; it opens on creation, emits `dismiss` on
 * Esc / close button / backdrop click, and returns focus to the trigger when destroyed.
 * Below the sm breakpoint it is shown as a bottom sheet.
 */
@Component({
  selector: 'app-dialog',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      class="dialog"
      [attr.aria-labelledby]="titleId"
      [attr.aria-describedby]="description() ? descriptionId : null"
      (cancel)="onCancel($event)"
      (click)="onBackdropClick($event)">
      <div class="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <h2 [id]="titleId" class="text-xl">{{ heading() }}</h2>
          @if (description()) {
            <p [id]="descriptionId" class="mt-2 text-[15px] leading-normal text-ink-soft">{{ description() }}</p>
          }
        </div>
        <button
          type="button"
          class="btn-icon -mt-2 -mr-2"
          [attr.aria-label]="'common.close' | t"
          (click)="dismiss.emit()">
          <i class="fa-solid fa-xmark text-lg" aria-hidden="true"></i>
        </button>
      </div>
      <div class="px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
        <ng-content/>
      </div>
    </dialog>
  `
})
export class Dialog implements OnDestroy {
  heading = input.required<string>();
  description = input<string>();
  dismiss = output();

  protected readonly titleId = `dialog-title-${++nextId}`;
  protected readonly descriptionId = `dialog-description-${nextId}`;

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly opener = inject(DOCUMENT).activeElement as HTMLElement | null;

  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  ngOnDestroy(): void {
    this.dialog().nativeElement.close();
    this.opener?.focus?.();
  }

  protected onCancel(event: Event): void {
    // Let the parent decide (it removes the dialog), instead of the browser closing it.
    event.preventDefault();
    this.dismiss.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.dismiss.emit();
    }
  }
}
