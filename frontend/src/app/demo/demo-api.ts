import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {map, mergeMap, Observable, throwError, timer} from 'rxjs';
import {environment} from '@environments/environment';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {Analytics, WeeklyCount} from '@app/analytics/models/analytics-model';
import {Exam} from '@app/exams/models/exam-model';
import {Report, ReportChanges} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {User} from '@app/users/models/user-model';
import {UserRole} from '@app/users/models/user-role-enum';
import {DemoDatabase, DemoUser, localIso, publicUser, seedDatabase} from '@app/demo/demo-data';

/** Long enough for loading states to show, short enough not to feel slow. */
const LATENCY_MS = 300;
const WEEKS = 6;
const STALE_AFTER_DAYS = 2;

/** Same shape and codes as the backend's GlobalExceptionHandler. */
class ApiException {
  constructor(readonly status: number, readonly code: string, readonly message: string,
              readonly fieldErrors?: Record<string, string>) {
  }
}

interface ApiResult {
  status: number;
  body: unknown;
}

const ok = (body: unknown): ApiResult => ({status: 200, body});

const reportNotFound = (id: number) => new ApiException(404, 'REPORT_NOT_FOUND', `Report not found with id: ${id}`);

/**
 * In-memory stand-in for the Spring Boot API, for the browser-only demo. It mirrors the backend:
 * HTTP Basic authentication, role rules from SecurityConfig and the business rules of the services.
 * Data is seeded on the first request and lost on page reload.
 */
@Injectable({
  providedIn: 'root'
})
export class DemoApi {
  private readonly i18n = inject(I18nService);
  private database: DemoDatabase | null = null;

  handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const path = request.url.slice(environment.backendUrl.length).split('?')[0];
    let result: ApiResult;
    try {
      result = this.route(request, path);
    } catch (error) {
      if (!(error instanceof ApiException)) {
        throw error;
      }
      const body = {
        timestamp: new Date().toISOString(),
        status: error.status,
        code: error.code,
        message: error.message,
        path,
        fieldErrors: error.fieldErrors
      };
      return timer(LATENCY_MS).pipe(mergeMap(() => throwError(() =>
        new HttpErrorResponse({status: error.status, error: body, url: request.url}))));
    }
    // Copies, so components never share objects with the "server".
    return timer(LATENCY_MS).pipe(map(() =>
      new HttpResponse({status: result.status, body: structuredClone(result.body), url: request.url})));
  }

  private get db(): DemoDatabase {
    this.database ??= seedDatabase(this.i18n.language(), new Date());
    return this.database;
  }

  private route(request: HttpRequest<unknown>, path: string): ApiResult {
    const {method} = request;
    if (method === 'POST' && path === '/auth/login') {
      return ok(this.login(request.body));
    }

    const me = this.authenticate(request.headers.get('Authorization'));
    const doctorOnly = /^\/(exams|analytics|users)(\/|$)/.test(path) || (/^\/reports(\/|$)/.test(path) && method !== 'GET');
    if (doctorOnly && me.role !== UserRole.DOCTOR) {
      throw new ApiException(403, 'ACCESS_DENIED', 'Access denied');
    }

    const body = request.body as Record<string, unknown> | null;
    let match: RegExpMatchArray | null;
    if (path === '/reports') {
      if (method === 'GET') {
        return ok(this.visibleReports(me));
      }
      if (method === 'POST') {
        return ok(this.createReport(me, body));
      }
    }
    if ((match = path.match(/^\/reports\/by-status\/(\w+)$/)) && method === 'GET') {
      return ok(this.visibleReports(me).filter(report => report.status === match![1]));
    }
    if ((match = path.match(/^\/reports\/(\d+)$/))) {
      const id = Number(match[1]);
      if (method === 'GET') {
        return ok(this.readReport(me, id));
      }
      if (method === 'PUT') {
        return ok(this.updateReport(id, body as unknown as ReportChanges));
      }
    }
    if ((match = path.match(/^\/reports\/(\d+)\/finalize$/)) && method === 'PUT') {
      return ok(this.finalizeReport(Number(match[1]), body as unknown as ReportChanges));
    }
    if ((match = path.match(/^\/reports\/(\d+)\/exams$/)) && method === 'POST') {
      return ok(this.createExam(Number(match[1]), body));
    }
    if ((match = path.match(/^\/exams\/(\d+)$/))) {
      if (method === 'PUT') {
        return ok(this.updateExam(Number(match[1]), body));
      }
      if (method === 'DELETE') {
        this.deleteExam(Number(match[1]));
        return {status: 204, body: null};
      }
    }
    if (path === '/users' && method === 'GET') {
      return ok(this.db.users.map(publicUser));
    }
    if (path === '/users/patients' && method === 'GET') {
      return ok(this.db.users.filter(user => user.role === UserRole.PATIENT).map(publicUser));
    }
    if (path === '/analytics' && method === 'GET') {
      return ok(this.analytics());
    }
    throw new ApiException(404, 'NOT_FOUND', 'Not Found');
  }

  // --- Authentication -------------------------------------------------------------------------

  private login(body: unknown): User {
    const {email, password} = (body ?? {}) as {email?: string; password?: string};
    if (!email?.trim() || !password?.trim()) {
      throw new ApiException(400, 'VALIDATION_FAILED', 'Validation failed', {
        ...(!email?.trim() && {email: 'must not be blank'}),
        ...(!password?.trim() && {password: 'must not be blank'})
      });
    }
    const user = this.findCredentials(email, password);
    if (!user) {
      throw new ApiException(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    return publicUser(user);
  }

  private authenticate(header: string | null): DemoUser {
    const credentials = header?.startsWith('Basic ') ? decodeBasic(header.slice(6)) : null;
    const user = credentials && this.findCredentials(credentials.email, credentials.password);
    if (!user) {
      throw new ApiException(401, 'UNAUTHENTICATED', 'Authentication required');
    }
    return user;
  }

  private findCredentials(email: string, password: string): DemoUser | undefined {
    return this.db.users.find(user => user.email === email && user.password === password);
  }

  // --- Reports (ReportsService) ---------------------------------------------------------------

  private visibleReports(me: DemoUser): Report[] {
    return this.db.reports.filter(report =>
      me.role === UserRole.DOCTOR ? report.createdBy?.id === me.id : report.patient?.id === me.id);
  }

  // Patients get 404 rather than 403 for other patients' reports, so ids cannot be probed.
  private readReport(me: DemoUser, id: number): Report {
    const report = this.findReport(id);
    if (me.role !== UserRole.DOCTOR && report.patient?.id !== me.id) {
      throw reportNotFound(id);
    }
    return report;
  }

  private createReport(me: DemoUser, body: Record<string, unknown> | null): Report {
    const now = localIso(new Date());
    const report: Report = {
      id: this.db.nextReportId++,
      patient: this.findPatient(body?.['patient']),
      createdBy: publicUser(me),
      status: ReportStatus.CREATED,
      createdAt: now,
      updatedAt: now,
      finalizedAt: null,
      outcome: null,
      exams: []
    };
    this.db.reports.push(report);
    return report;
  }

  // Like the backend mapper, a save moves the report to IN_PROGRESS and leaves the patient alone.
  private updateReport(id: number, changes: ReportChanges | null): Report {
    const report = this.findEditableReport(id, 'modified');
    const outcome = validOutcome(changes?.outcome);
    Object.assign(report, {outcome, status: ReportStatus.IN_PROGRESS, updatedAt: localIso(new Date())});
    return report;
  }

  // Validates everything before changing anything, as the backend transaction would roll back.
  private finalizeReport(id: number, changes: ReportChanges | null): Report {
    const report = this.findEditableReport(id, 'finalized');
    const patient = this.findPatient(changes?.patient);
    const outcome = validOutcome(changes?.outcome);
    if (!report.exams.length) {
      throw new ApiException(409, 'REPORT_MISSING_EXAMS', 'Cannot finalize report without exams.');
    }
    if (!outcome?.trim()) {
      throw new ApiException(409, 'REPORT_MISSING_OUTCOME', 'Cannot finalize report without an outcome.');
    }
    const now = localIso(new Date());
    Object.assign(report, {patient, outcome, status: ReportStatus.FINALIZED, finalizedAt: now, updatedAt: now});
    return report;
  }

  private createExam(reportId: number, body: Record<string, unknown> | null): Report {
    const report = this.findEditableReport(reportId, 'modified');
    const now = localIso(new Date());
    report.exams.push({id: this.db.nextExamId++, ...validExam(body), createdAt: now});
    report.status = ReportStatus.IN_PROGRESS;
    report.updatedAt = now;
    return report;
  }

  private findReport(id: number): Report {
    const report = this.db.reports.find(candidate => candidate.id === id);
    if (!report) {
      throw reportNotFound(id);
    }
    return report;
  }

  private findEditableReport(id: number, action: 'modified' | 'finalized'): Report {
    const report = this.findReport(id);
    if (report.status === ReportStatus.FINALIZED) {
      throw new ApiException(409, 'REPORT_NOT_EDITABLE',
        `Report can only be ${action} when in IN_PROGRESS or CREATED status.`);
    }
    return report;
  }

  private findPatient(ref: unknown): User {
    const email = (ref as {email?: unknown} | null | undefined)?.email;
    if (typeof email !== 'string') {
      throw new ApiException(409, 'PATIENT_REQUIRED', 'A patient is required.');
    }
    const patient = this.db.users.find(user => user.email === email && user.role === UserRole.PATIENT);
    if (!patient) {
      throw new ApiException(404, 'PATIENT_NOT_FOUND', 'Patient not found.');
    }
    return publicUser(patient);
  }

  // --- Exams (ExamsService) -------------------------------------------------------------------

  private updateExam(id: number, body: Record<string, unknown> | null): Exam {
    const {report, exam} = this.findEditableExam(id);
    Object.assign(exam, validExam(body));
    report.updatedAt = localIso(new Date());
    return exam;
  }

  private deleteExam(id: number): void {
    const {report, exam} = this.findEditableExam(id);
    report.exams = report.exams.filter(candidate => candidate !== exam);
    report.updatedAt = localIso(new Date());
  }

  private findEditableExam(id: number): {report: Report; exam: Exam} {
    for (const report of this.db.reports) {
      const exam = report.exams.find(candidate => candidate.id === id);
      if (exam) {
        if (report.status === ReportStatus.FINALIZED) {
          throw new ApiException(409, 'REPORT_NOT_EDITABLE', 'Report is already finalized.');
        }
        return {report, exam};
      }
    }
    throw new ApiException(404, 'EXAM_NOT_FOUND', `Exam not found with id: ${id}`);
  }

  // --- Analytics (AnalyticsService): over the whole clinic, not just the signed-in doctor -----

  private analytics(): Analytics {
    const {users, reports} = this.db;
    const now = new Date();
    const countStatus = (status: ReportStatus) => reports.filter(report => report.status === status).length;
    const staleBefore = new Date(now.getTime() - STALE_AFTER_DAYS * 24 * 60 * 60 * 1000);
    const exams = reports.flatMap(report => report.exams);
    const minutesToFinalize = reports
      .filter(report => report.status === ReportStatus.FINALIZED && report.finalizedAt && report.createdAt)
      .map(report => Math.floor((Date.parse(report.finalizedAt!) - Date.parse(report.createdAt!)) / 60000));

    return {
      createdReports: countStatus(ReportStatus.CREATED),
      inProgressReports: countStatus(ReportStatus.IN_PROGRESS),
      finalizedReports: countStatus(ReportStatus.FINALIZED),
      totalReports: reports.length,
      staleCreatedReports: reports
        .filter(report => report.status === ReportStatus.CREATED && new Date(report.createdAt!) < staleBefore).length,
      totalUsers: users.length,
      totalPatients: users.filter(user => user.role === UserRole.PATIENT).length,
      totalDoctors: users.filter(user => user.role === UserRole.DOCTOR).length,
      averageMinutesInProgress: minutesToFinalize.length
        ? Math.round(minutesToFinalize.reduce((sum, minutes) => sum + minutes, 0) / minutesToFinalize.length)
        : null,
      totalExams: exams.length,
      outOfRangeExams: exams.filter(exam =>
        (exam.refMin != null && exam.examValue < exam.refMin) || (exam.refMax != null && exam.examValue > exam.refMax)).length,
      reportsPerWeek: reportsPerWeek(reports, now)
    };
  }
}

export const demoApiInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(environment.backendUrl)) {
    return next(request);
  }
  return inject(DemoApi).handle(request);
};

function decodeBasic(token: string): {email: string; password: string} | null {
  try {
    const decoded = atob(token);
    const separator = decoded.indexOf(':');
    return separator < 0 ? null : {email: decoded.slice(0, separator), password: decoded.slice(separator + 1)};
  } catch {
    return null;
  }
}

/** ReportDTO: @Size(max = 2000) on outcome. */
function validOutcome(outcome: string | null | undefined): string | null {
  if (outcome && outcome.length > 2000) {
    throw new ApiException(400, 'VALIDATION_FAILED', 'Validation failed', {outcome: 'size must be between 0 and 2000'});
  }
  return outcome ?? null;
}

/** ExamDTO bean validation, with Spring's default messages. */
function validExam(body: Record<string, unknown> | null): Omit<Exam, 'id' | 'createdAt'> {
  const text = (value: unknown) => (typeof value === 'string' ? value : '');
  const number = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
  const analysis = text(body?.['analysis']);
  const unitOfMeasure = text(body?.['unitOfMeasure']);
  const examValue = number(body?.['examValue']);
  const refMin = number(body?.['refMin']);
  const refMax = number(body?.['refMax']);

  const fieldErrors: Record<string, string> = {};
  if (!analysis.trim()) {
    fieldErrors['analysis'] = 'must not be blank';
  } else if (analysis.length > 120) {
    fieldErrors['analysis'] = 'size must be between 0 and 120';
  }
  if (!unitOfMeasure.trim()) {
    fieldErrors['unitOfMeasure'] = 'must not be blank';
  } else if (unitOfMeasure.length > 30) {
    fieldErrors['unitOfMeasure'] = 'size must be between 0 and 30';
  }
  if (examValue === null) {
    fieldErrors['examValue'] = 'must not be null';
  }
  if (refMin !== null && refMax !== null && refMin > refMax) {
    fieldErrors['referenceRangeValid'] = 'refMin must not be greater than refMax';
  }
  if (Object.keys(fieldErrors).length) {
    throw new ApiException(400, 'VALIDATION_FAILED', 'Validation failed', fieldErrors);
  }
  return {analysis, unitOfMeasure, examValue: examValue!, refMin, refMax};
}

/** Reports created in each of the last six weeks, Monday first, oldest week first. */
function reportsPerWeek(reports: Report[], now: Date): WeeklyCount[] {
  const currentWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  currentWeek.setDate(currentWeek.getDate() - ((currentWeek.getDay() + 6) % 7));
  const weeks = Array.from({length: WEEKS}, (_, i) => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - 7 * (WEEKS - 1 - i));
    return start;
  });
  return weeks.map((start, i) => {
    const end = weeks[i + 1] ?? new Date(8.64e15);
    const count = reports.filter(report => {
      const createdAt = new Date(report.createdAt!);
      return createdAt >= start && createdAt < end;
    }).length;
    return {weekStart: localIso(start).slice(0, 10), count};
  });
}
