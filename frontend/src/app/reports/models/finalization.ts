import {Report} from '@app/reports/models/report-model';
import {TranslationKey} from '@app/commons/i18n/i18n-types';

export interface ChecklistItem {
  key: TranslationKey;
  done: boolean;
}

export interface FinalizationChecklist {
  items: ChecklistItem[];
  ready: boolean;
  missing: TranslationKey[];
}

/**
 * Mirrors the backend rules for finalization (patient set, at least one exam, outcome written).
 * `outcomeDraft` is the text currently in the editor, which is sent along with the request.
 */
export function finalizationChecklist(report: Pick<Report, 'patient' | 'exams'>, outcomeDraft: string | null | undefined): FinalizationChecklist {
  const items: ChecklistItem[] = [
    {key: 'reports.checklist.patient', done: !!report.patient},
    {key: 'reports.checklist.exams', done: (report.exams ?? []).length > 0},
    {key: 'reports.checklist.outcome', done: !!outcomeDraft && outcomeDraft.trim().length > 0}
  ];
  const missing = items.filter(item => !item.done).map(item => item.key);
  return {items, ready: missing.length === 0, missing};
}
