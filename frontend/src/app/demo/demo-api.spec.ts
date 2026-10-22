import {TestBed} from '@angular/core/testing';
import {HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {environment} from '@environments/environment';
import {DemoApi} from '@app/demo/demo-api';
import {DEMO_LOGIN_ACCOUNTS} from '@app/demo/demo-data';
import {Report} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {UserRole} from '@app/users/models/user-role-enum';
import {Analytics} from '@app/analytics/models/analytics-model';

const doctor = DEMO_LOGIN_ACCOUNTS.find(account => account.role === UserRole.DOCTOR)!;
const patient = DEMO_LOGIN_ACCOUNTS.find(account => account.role === UserRole.PATIENT)!;

describe('DemoApi', () => {
  let api: DemoApi;

  beforeEach(() => {
    vi.useFakeTimers();
    api = TestBed.inject(DemoApi);
  });

  afterEach(() => vi.useRealTimers());

  async function call(method: string, path: string, as: typeof doctor | null, body: unknown = null) {
    const headers = as ? new HttpHeaders({Authorization: `Basic ${btoa(`${as.email}:${as.password}`)}`}) : new HttpHeaders();
    const request = new HttpRequest(method, `${environment.backendUrl}${path}`, body, {headers});
    const result = firstValueFrom(api.handle(request)).then(
      event => ({status: (event as HttpResponse<unknown>).status, body: (event as HttpResponse<unknown>).body as never, code: null}),
      (error: HttpErrorResponse) => ({status: error.status, body: null as never, code: error.error.code as string}));
    await vi.advanceTimersByTimeAsync(300);
    return result;
  }

  it('logs in seeded accounts and rejects wrong passwords', async () => {
    expect((await call('POST', '/auth/login', null, {email: doctor.email, password: 'demo'})).status).toBe(200);
    expect(await call('POST', '/auth/login', null, {email: doctor.email, password: 'nope'}))
      .toMatchObject({status: 401, code: 'INVALID_CREDENTIALS'});
    expect(await call('GET', '/reports', null)).toMatchObject({status: 401, code: 'UNAUTHENTICATED'});
  });

  it('shows doctors the reports they created and patients only their own', async () => {
    const doctorReports: Report[] = (await call('GET', '/reports', doctor)).body;
    const patientReports: Report[] = (await call('GET', '/reports', patient)).body;
    expect(doctorReports.length).toBeGreaterThanOrEqual(10);
    expect(doctorReports.every(report => report.createdBy?.email === doctor.email)).toBe(true);
    expect(patientReports.every(report => report.patient.email === patient.email)).toBe(true);

    const othersReport = doctorReports.find(report => report.patient.email !== patient.email)!;
    expect(await call('GET', `/reports/${othersReport.id}`, patient)).toMatchObject({status: 404, code: 'REPORT_NOT_FOUND'});
    expect(await call('GET', '/analytics', patient)).toMatchObject({status: 403, code: 'ACCESS_DENIED'});
  });

  it('walks a report from creation to finalization with the backend rules', async () => {
    const created: Report = (await call('POST', '/reports', doctor, {patient: {email: patient.email}})).body;
    expect(created.status).toBe(ReportStatus.CREATED);

    expect(await call('PUT', `/reports/${created.id}/finalize`, doctor, {patient: {email: patient.email}, outcome: 'Fine.'}))
      .toMatchObject({status: 409, code: 'REPORT_MISSING_EXAMS'});

    expect(await call('POST', `/reports/${created.id}/exams`, doctor, {analysis: 'LDL', unitOfMeasure: 'mg/dL', examValue: 90, refMin: 10, refMax: 5}))
      .toMatchObject({status: 400, code: 'VALIDATION_FAILED'});
    const withExam: Report = (await call('POST', `/reports/${created.id}/exams`, doctor,
      {analysis: 'LDL', unitOfMeasure: 'mg/dL', examValue: 90, refMin: null, refMax: 100})).body;
    expect(withExam.status).toBe(ReportStatus.IN_PROGRESS);

    expect(await call('PUT', `/reports/${created.id}/finalize`, doctor, {patient: {email: patient.email}, outcome: '  '}))
      .toMatchObject({status: 409, code: 'REPORT_MISSING_OUTCOME'});
    const finalized: Report = (await call('PUT', `/reports/${created.id}/finalize`, doctor, {patient: {email: patient.email}, outcome: 'Fine.'})).body;
    expect(finalized.status).toBe(ReportStatus.FINALIZED);
    expect(finalized.finalizedAt).toBeTruthy();

    expect(await call('DELETE', `/exams/${withExam.exams[0].id}`, doctor)).toMatchObject({status: 409, code: 'REPORT_NOT_EDITABLE'});
    expect((await call('GET', `/reports/${created.id}`, patient)).body).toMatchObject({outcome: 'Fine.'});
  });

  it('computes statistics from the current data', async () => {
    const before: Analytics = (await call('GET', '/analytics', doctor)).body;
    expect(before.reportsPerWeek).toHaveLength(6);
    expect(before.staleCreatedReports).toBeGreaterThan(0);

    await call('POST', '/reports', doctor, {patient: {email: patient.email}});
    const after: Analytics = (await call('GET', '/analytics', doctor)).body;
    expect(after.totalReports).toBe(before.totalReports + 1);
    expect(after.createdReports).toBe(before.createdReports + 1);
  });

  it('answers unknown endpoints with 404 instead of reaching the network', async () => {
    expect(await call('GET', '/nope', doctor)).toMatchObject({status: 404, code: 'NOT_FOUND'});
  });
});
