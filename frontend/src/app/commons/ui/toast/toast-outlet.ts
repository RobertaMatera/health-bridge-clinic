import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ToastService} from '@app/commons/ui/toast/toast-service';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

/**
 * Both live regions are always in the DOM; screen readers only announce changes to regions
 * that already exist. Success messages are polite, errors assertive.
 */
@Component({
  selector: 'app-toast-outlet',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'pointer-events-none fixed inset-x-4 bottom-4 z-[150] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end print:hidden'},
  template: `
    <div role="status" class="contents">
      @for (toast of successes(); track toast.id) {
        <div class="toast toast-success">
          <i class="fa-solid fa-circle-check mt-0.5" aria-hidden="true"></i>
          <span class="flex-1">{{ toast.key | t: toast.params }}</span>
          <button type="button" class="btn-icon -my-2 -mr-2 text-current" [attr.aria-label]="'toast.dismiss' | t" (click)="toastService.dismiss(toast.id)">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
    <div role="alert" class="contents">
      @for (toast of errors(); track toast.id) {
        <div class="toast toast-error">
          <i class="fa-solid fa-triangle-exclamation mt-0.5" aria-hidden="true"></i>
          <span class="flex-1">{{ toast.key | t: toast.params }}</span>
          <button type="button" class="btn-icon -my-2 -mr-2 text-current" [attr.aria-label]="'toast.dismiss' | t" (click)="toastService.dismiss(toast.id)">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastOutlet {
  protected readonly toastService = inject(ToastService);
  protected readonly successes = computed(() => this.toastService.toasts().filter(toast => toast.kind === 'success'));
  protected readonly errors = computed(() => this.toastService.toasts().filter(toast => toast.kind === 'error'));
}
