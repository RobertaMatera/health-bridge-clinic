import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {NewReportForm} from '@app/reports/components/new-report-form/new-report-form';
import {Report} from '@app/reports/models/report-model';
import {ToastService} from '@app/commons/ui/toast/toast-service';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';

@Component({
  selector: 'app-create-report-page',
  imports: [NewReportForm, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="mb-6 text-[30px]">{{ 'reports.create.title' | t }}</h1>
    <section class="card max-w-xl p-5 sm:p-6">
      <app-new-report-form (created)="onCreated($event)" (cancel)="router.navigate(['/reports'])"/>
    </section>
  `
})
export class CreateReportPage {
  protected readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected onCreated(report: Report): void {
    this.toastService.success('reports.create.created', {id: report.id});
    this.router.navigate(['/reports', report.id]);
  }
}
