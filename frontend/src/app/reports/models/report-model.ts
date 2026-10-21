import {BaseModel} from '@app/commons/models/base-model';
import {User} from '@app/users/models/user-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {Exam} from '@app/exams/models/exam-model';

export interface Report extends BaseModel {
  id: number;
  patient: User;
  status: ReportStatus;
  finalizedAt?: string | null;
  outcome?: string | null;
  exams: Exam[];
}

/** The API identifies the patient by email. */
export interface PatientRef {
  email: string;
}

export interface NewReport {
  patient: PatientRef;
}

export interface ReportChanges {
  patient: PatientRef;
  outcome: string | null;
}
