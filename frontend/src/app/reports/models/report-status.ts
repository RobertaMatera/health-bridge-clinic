import {ReportStatus} from '@app/reports/models/report-status-enum';
import {TranslationKey} from '@app/commons/i18n/i18n-types';

/** Patients see plain-language labels ("Ready" instead of "Finalized"). */
export type StatusAudience = 'doctor' | 'patient';

export const REPORT_STATUSES: readonly ReportStatus[] = [ReportStatus.CREATED, ReportStatus.IN_PROGRESS, ReportStatus.FINALIZED];

export function statusKey(status: ReportStatus, audience: StatusAudience = 'doctor'): TranslationKey {
  return audience === 'patient' ? `patientStatus.${status}` : `status.${status}`;
}

export function statusBadgeClass(status: ReportStatus): string {
  switch (status) {
    case ReportStatus.CREATED:
      return 'badge-created';
    case ReportStatus.IN_PROGRESS:
      return 'badge-progress';
    case ReportStatus.FINALIZED:
      return 'badge-final';
  }
}
