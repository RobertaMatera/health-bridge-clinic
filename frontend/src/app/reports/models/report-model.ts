import {BaseModel} from '@app/commons/models/base-model';
import {User} from '@app/users/models/user-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {Exam} from '@app/exams/models/exam-model';

export interface Report extends BaseModel {
  patient: User;
  finalizedAt?: Date;
  status?: ReportStatus;
  outcome?: string | null;
  exams?: Exam[];
}
