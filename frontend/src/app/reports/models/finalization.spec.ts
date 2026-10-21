import {finalizationChecklist} from '@app/reports/models/finalization';
import {Report} from '@app/reports/models/report-model';
import {UserRole} from '@app/users/models/user-role-enum';

const patient = {id: 1, firstName: 'Giuseppe', lastName: 'Massari', email: 'g.massari@gmail.com', role: UserRole.PATIENT};
const anExam = {id: 1, analysis: 'LDL', unitOfMeasure: 'mg/dL', examValue: 120};

describe('finalizationChecklist', () => {
  it('is ready when patient, exams and outcome are present', () => {
    const checklist = finalizationChecklist({patient, exams: [anExam]}, 'All good.');
    expect(checklist.ready).toBe(true);
    expect(checklist.missing).toEqual([]);
    expect(checklist.items.every(item => item.done)).toBe(true);
  });

  it('requires at least one exam', () => {
    const checklist = finalizationChecklist({patient, exams: []}, 'All good.');
    expect(checklist.ready).toBe(false);
    expect(checklist.missing).toEqual(['reports.checklist.exams']);
  });

  it('treats a blank outcome as missing', () => {
    for (const outcome of [null, undefined, '', '   \n']) {
      expect(finalizationChecklist({patient, exams: [anExam]}, outcome).missing).toEqual(['reports.checklist.outcome']);
    }
  });

  it('lists every missing item in checklist order', () => {
    const checklist = finalizationChecklist({patient: undefined as unknown as Report['patient'], exams: []}, '');
    expect(checklist.missing).toEqual(['reports.checklist.patient', 'reports.checklist.exams', 'reports.checklist.outcome']);
  });
});
