import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {catchError, of} from 'rxjs';
import {ReportsService} from '@app/reports/services/reports-service';
import {Report} from '@app/reports/models/report-model';
import {reportTimeline} from '@app/reports/models/report-timeline';
import {Avatar} from '@app/commons/ui/avatar/avatar';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {LocalDatePipe} from '@app/commons/i18n/local-date-pipe';
import {fullName} from '@app/users/models/user-name';

/** Patient card, report details and the timeline built from the stored timestamps. */
@Component({
  selector: 'app-report-sidebar',
  imports: [RouterLink, Avatar, TranslatePipe, LocalDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'flex flex-col gap-4'},
  template: `
    <section class="card p-5" aria-labelledby="patient-card-title">
      <h2 id="patient-card-title" class="card-title mb-3.5">{{ 'reports.patientCard.title' | t }}</h2>
      <div class="flex items-center gap-3">
        <app-avatar [firstName]="report().patient.firstName" [lastName]="report().patient.lastName" size="lg"/>
        <div class="min-w-0">
          <p class="font-bold">{{ name(report().patient) }}</p>
          <p class="truncate text-sm text-muted">{{ report().patient.email }}</p>
        </div>
      </div>
      <a class="link mt-3.5 inline-flex min-h-11 items-center text-sm" routerLink="/reports" [queryParams]="{q: name(report().patient)}">
        @if (historyCount(); as count) {
          {{ 'reports.patientCard.historyCount' | t: {count: count} }}
        } @else {
          {{ 'reports.patientCard.history' | t }}
        }
      </a>
    </section>

    <section class="card p-5" aria-labelledby="details-card-title">
      <h2 id="details-card-title" class="card-title mb-3.5">{{ 'reports.details.title' | t }}</h2>
      <dl class="grid grid-cols-2 gap-4">
        <div>
          <dt class="text-[13px] font-medium text-muted">{{ 'reports.details.createdBy' | t }}</dt>
          <dd class="mt-0.5 text-[15px] font-semibold">
            @if (report().createdBy; as doctor) {
              {{ 'common.doctorName' | t: {name: name(doctor)} }}
            } @else {
              {{ 'common.none' | t }}
            }
          </dd>
        </div>
        <div>
          <dt class="text-[13px] font-medium text-muted">{{ 'reports.details.createdAt' | t }}</dt>
          <dd class="mt-0.5 text-[15px] font-semibold">{{ report().createdAt | localDate }}</dd>
        </div>
        <div>
          <dt class="text-[13px] font-medium text-muted">{{ 'reports.details.updatedAt' | t }}</dt>
          <dd class="mt-0.5 text-[15px] font-semibold">{{ report().updatedAt | localDate }}</dd>
        </div>
        <div>
          <dt class="text-[13px] font-medium text-muted">{{ 'reports.details.finalizedAt' | t }}</dt>
          <dd class="mt-0.5 text-[15px]" [class]="report().finalizedAt ? 'font-semibold' : 'text-muted'">
            {{ report().finalizedAt ? (report().finalizedAt | localDate) : ('common.none' | t) }}
          </dd>
        </div>
      </dl>
    </section>

    <section class="card p-5" aria-labelledby="timeline-card-title">
      <h2 id="timeline-card-title" class="card-title mb-3.5">{{ 'reports.timeline.title' | t }}</h2>
      <ol class="flex flex-col gap-3.5 border-l-2 border-line pl-3.5 text-sm">
        @for (event of timeline(); track $index) {
          <li class="relative">
            <span class="absolute top-1.5 -left-[21px] size-2.5 rounded-full border-2 border-surface bg-brand" aria-hidden="true"></span>
            <p class="font-semibold">{{ event.key | t: event.params }}</p>
            <p class="text-muted"><time [attr.datetime]="event.at">{{ event.at | localDate: 'dateTime' }}</time></p>
          </li>
        }
      </ol>
    </section>
  `
})
export class ReportSidebar {
  report = input.required<Report>();
  protected readonly name = fullName;
  protected readonly timeline = computed(() => reportTimeline(this.report()));

  // Fetched once; the count is optional, so a failed request just hides it.
  private readonly allReports = toSignal(
    inject(ReportsService).getAll().pipe(catchError(() => of(null))),
    {initialValue: null});

  protected readonly historyCount = computed(() => {
    const reports = this.allReports();
    const patientId = this.report().patient.id;
    return reports && patientId !== undefined
      ? reports.filter(report => report.patient.id === patientId).length
      : null;
  });
}
