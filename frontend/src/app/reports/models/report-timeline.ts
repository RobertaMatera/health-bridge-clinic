import {Report} from '@app/reports/models/report-model';
import {TranslationKey, TranslationParams} from '@app/commons/i18n/i18n-types';

export interface TimelineEvent {
  at: string;
  key: TranslationKey;
  params?: TranslationParams;
}

/** History reconstructed from the stored timestamps, newest first. */
export function reportTimeline(report: Report): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  if (report.createdAt) {
    events.push({at: report.createdAt, key: 'reports.timeline.created'});
  }
  for (const exam of report.exams ?? []) {
    if (exam.createdAt) {
      events.push({at: exam.createdAt, key: 'reports.timeline.examAdded', params: {name: exam.analysis}});
    }
  }
  if (report.finalizedAt) {
    events.push({at: report.finalizedAt, key: 'reports.timeline.finalized'});
  }
  return events.sort((a, b) => b.at.localeCompare(a.at));
}
