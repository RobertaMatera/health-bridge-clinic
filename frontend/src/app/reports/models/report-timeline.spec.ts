import {reportTimeline} from '@app/reports/models/report-timeline';
import {Report} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {UserRole} from '@app/users/models/user-role-enum';

describe('reportTimeline', () => {
  it('builds the history from timestamps, newest first', () => {
    const report: Report = {
      id: 1,
      status: ReportStatus.FINALIZED,
      patient: {id: 1, firstName: 'A', lastName: 'B', email: 'a@b.it', role: UserRole.PATIENT},
      createdAt: '2026-10-01T09:00:00',
      finalizedAt: '2026-10-03T10:00:00',
      exams: [
        {analysis: 'HDL', unitOfMeasure: 'mg/dL', examValue: 50, createdAt: '2026-10-02T08:00:00'},
        {analysis: 'LDL', unitOfMeasure: 'mg/dL', examValue: 90}
      ]
    };

    expect(reportTimeline(report).map(event => [event.key, event.params?.['name'] ?? null])).toEqual([
      ['reports.timeline.finalized', null],
      ['reports.timeline.examAdded', 'HDL'],
      ['reports.timeline.created', null]
    ]);
  });
});
