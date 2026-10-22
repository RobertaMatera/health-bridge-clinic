import {Language} from '@app/commons/i18n/i18n-types';
import {Exam} from '@app/exams/models/exam-model';
import {Report} from '@app/reports/models/report-model';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {User} from '@app/users/models/user-model';
import {UserRole} from '@app/users/models/user-role-enum';
import {DemoAccount} from '@app/auth/models/demo-accounts';

/*
 * Fictional people and results for the browser-only demo. Any resemblance to real people is
 * coincidental. Medical text exists in both languages and is picked once, when the data is seeded.
 */

interface Text {
  en: string;
  it: string;
}

export interface DemoUser extends User {
  id: number;
  password: string;
}

interface SeedExam {
  analysis: Text;
  unitOfMeasure: string;
  examValue: number;
  refMin: number | null;
  refMax: number | null;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const DEMO_PASSWORD = 'demo';

const user = (id: number, firstName: string, lastName: string, email: string, role: UserRole): DemoUser =>
  ({id, firstName, lastName, email: `${email}@healthbridge.test`, role, password: DEMO_PASSWORD});

const VALLI = user(1, 'Chiara', 'Valli', 'c.valli', UserRole.DOCTOR);
const NERI = user(2, 'Tommaso', 'Neri', 't.neri', UserRole.DOCTOR);
const FONTANA = user(3, 'Giulia', 'Fontana', 'g.fontana', UserRole.PATIENT);
const MORETTI = user(4, 'Davide', 'Moretti', 'd.moretti', UserRole.PATIENT);
const COLOMBO = user(5, 'Anna', 'Colombo', 'a.colombo', UserRole.PATIENT);
const FERRI = user(6, 'Marco', 'Ferri', 'm.ferri', UserRole.PATIENT);
const GRECO = user(7, 'Sara', 'Greco', 's.greco', UserRole.PATIENT);
const BIANCHI = user(8, 'Paolo', 'Bianchi', 'p.bianchi', UserRole.PATIENT);
const CONTI = user(9, 'Elisa', 'Conti', 'e.conti', UserRole.PATIENT);
const GALLI = user(10, 'Matteo', 'Galli', 'm.galli', UserRole.PATIENT);

const USERS: readonly DemoUser[] = [VALLI, NERI, FONTANA, MORETTI, COLOMBO, FERRI, GRECO, BIANCHI, CONTI, GALLI];

/** The first doctor and the first patient are the one-click logins. */
export const DEMO_LOGIN_ACCOUNTS: readonly DemoAccount[] = USERS.map(({firstName, lastName, email, role}) => ({
  name: role === UserRole.DOCTOR ? `Dr. ${firstName} ${lastName}` : `${firstName} ${lastName}`,
  email,
  password: DEMO_PASSWORD,
  role
}));

const exam = (en: string, it: string, unitOfMeasure: string) =>
  (examValue: number, refMin: number | null, refMax: number | null): SeedExam =>
    ({analysis: {en, it}, unitOfMeasure, examValue, refMin, refMax});

const HAEMOGLOBIN = exam('Haemoglobin', 'Emoglobina', 'g/dL');
const WHITE_CELLS = exam('White blood cells', 'Globuli bianchi', '10^3/µL');
const PLATELETS = exam('Platelets', 'Piastrine', '10^3/µL');
const GLUCOSE = exam('Fasting glucose', 'Glicemia a digiuno', 'mg/dL');
const HBA1C = exam('HbA1c', 'Emoglobina glicata', '%');
const INSULIN = exam('Insulin', 'Insulina', 'µU/mL');
const CHOLESTEROL = exam('Total cholesterol', 'Colesterolo totale', 'mg/dL');
const LDL = exam('LDL cholesterol', 'Colesterolo LDL', 'mg/dL');
const HDL = exam('HDL cholesterol', 'Colesterolo HDL', 'mg/dL');
const TRIGLYCERIDES = exam('Triglycerides', 'Trigliceridi', 'mg/dL');
const TSH = exam('TSH', 'TSH', 'mIU/L');
const FT4 = exam('FT4', 'FT4', 'ng/dL');
const VITAMIN_D = exam('Vitamin D (25-OH)', 'Vitamina D (25-OH)', 'ng/mL');
const FERRITIN = exam('Ferritin', 'Ferritina', 'ng/mL');
const SERUM_IRON = exam('Serum iron', 'Sideremia', 'µg/dL');
const CALCIUM = exam('Calcium', 'Calcio', 'mg/dL');
const CREATININE = exam('Creatinine', 'Creatinina', 'mg/dL');
const UREA = exam('Blood urea nitrogen', 'Azotemia', 'mg/dL');
const URIC_ACID = exam('Uric acid', 'Acido urico', 'mg/dL');
const SODIUM = exam('Sodium', 'Sodio', 'mmol/L');
const POTASSIUM = exam('Potassium', 'Potassio', 'mmol/L');
const AST = exam('AST', 'AST', 'U/L');
const ALT = exam('ALT', 'ALT', 'U/L');
const GAMMA_GT = exam('Gamma GT', 'Gamma GT', 'U/L');
const BILIRUBIN = exam('Total bilirubin', 'Bilirubina totale', 'mg/dL');
const CRP = exam('C-reactive protein', 'Proteina C reattiva', 'mg/dL');
const ESR = exam('ESR', 'VES', 'mm/h');
const PSA = exam('Total PSA', 'PSA totale', 'ng/mL');
const VITAMIN_B12 = exam('Vitamin B12', 'Vitamina B12', 'pg/mL');
const FOLATE = exam('Folate', 'Acido folico', 'ng/mL');

interface SeedReport {
  patient: DemoUser;
  doctor: DemoUser;
  status: ReportStatus;
  createdAgo: number;
  finalizedAgo?: number;
  outcome?: Text;
  exams?: SeedExam[];
}

const SEED_REPORTS: readonly SeedReport[] = [
  {
    patient: FONTANA, doctor: VALLI, status: ReportStatus.FINALIZED, createdAgo: 38 * DAY, finalizedAgo: 35 * DAY,
    outcome: {
      en: 'Complete blood count and fasting glucose are within normal limits. No action needed.',
      it: 'Emocromo e glicemia a digiuno nella norma. Nessun intervento necessario.'
    },
    exams: [HAEMOGLOBIN(13.4, 12, 16), WHITE_CELLS(6.8, 4, 10), PLATELETS(240, 150, 400), GLUCOSE(86, 70, 99)]
  },
  {
    // Finalized a couple of hours ago, so the patient sees a fresh result.
    patient: FONTANA, doctor: VALLI, status: ReportStatus.FINALIZED, createdAgo: 3 * DAY, finalizedAgo: 2 * HOUR,
    outcome: {
      en: 'Total and LDL cholesterol are slightly high. I recommend a diet low in saturated fat and 30 minutes of walking a day; we will repeat the test in 3 months.',
      it: 'Colesterolo totale e LDL lievemente alti. Consiglio una dieta povera di grassi saturi e 30 minuti di camminata al giorno; ripeteremo il controllo tra 3 mesi.'
    },
    exams: [CHOLESTEROL(212, null, 200), LDL(138, null, 100), HDL(58, 40, null), TRIGLYCERIDES(110, null, 150)]
  },
  {
    patient: FONTANA, doctor: VALLI, status: ReportStatus.IN_PROGRESS, createdAgo: 2 * DAY,
    exams: [TSH(2.1, 0.4, 4), FT4(1.3, 0.9, 1.7)]
  },
  {patient: FONTANA, doctor: VALLI, status: ReportStatus.CREATED, createdAgo: 5 * HOUR},
  {
    patient: MORETTI, doctor: VALLI, status: ReportStatus.FINALIZED, createdAgo: 27 * DAY, finalizedAgo: 24 * DAY,
    outcome: {
      en: 'Fasting glucose is slightly above the limit. I suggest a low glycaemic index diet and a new check in 3 months.',
      it: 'Glicemia lievemente sopra il limite. Consiglio una dieta a basso indice glicemico e un nuovo controllo tra 3 mesi.'
    },
    exams: [GLUCOSE(104, 70, 99), HBA1C(5.6, 4, 5.7)]
  },
  {
    patient: COLOMBO, doctor: VALLI, status: ReportStatus.FINALIZED, createdAgo: 40 * DAY, finalizedAgo: 36 * DAY,
    outcome: {
      en: 'Thyroid function is normal, with TSH close to the upper limit. We will repeat the test in 6 months.',
      it: 'Funzione tiroidea nella norma, con TSH vicino al limite superiore. Ripeteremo il controllo tra 6 mesi.'
    },
    exams: [TSH(3.9, 0.4, 4), FT4(1.2, 0.9, 1.7)]
  },
  {
    patient: COLOMBO, doctor: VALLI, status: ReportStatus.FINALIZED, createdAgo: 10 * DAY, finalizedAgo: 7 * DAY,
    outcome: {
      en: 'Sugar metabolism is normal; glucose is close to the limit. Keep up an active lifestyle.',
      it: 'Metabolismo degli zuccheri nella norma; glicemia vicina al limite. Mantenere uno stile di vita attivo.'
    },
    exams: [GLUCOSE(96, 70, 99), HBA1C(5.4, 4, 5.7), INSULIN(9, 2.6, 24.9)]
  },
  {
    patient: GRECO, doctor: VALLI, status: ReportStatus.FINALIZED, createdAgo: 42 * DAY, finalizedAgo: 40 * DAY,
    outcome: {
      en: 'Iron deficiency anaemia. I am prescribing an iron supplement for 3 months and a blood count check in 4 weeks.',
      it: 'Anemia da carenza di ferro. Prescrivo un integratore di ferro per 3 mesi e un controllo dell’emocromo tra 4 settimane.'
    },
    exams: [HAEMOGLOBIN(11.4, 12, 16), FERRITIN(12, 15, 150), SERUM_IRON(48, 50, 170)]
  },
  {
    patient: GRECO, doctor: VALLI, status: ReportStatus.FINALIZED, createdAgo: 14 * DAY, finalizedAgo: 12 * DAY,
    outcome: {
      en: 'Haemoglobin is back to normal and iron stores are improving. Continue the supplement for one more month.',
      it: 'L’emoglobina è tornata nella norma e le scorte di ferro stanno migliorando. Proseguire l’integratore per un altro mese.'
    },
    exams: [HAEMOGLOBIN(12.6, 12, 16), FERRITIN(28, 15, 150)]
  },
  {
    patient: BIANCHI, doctor: VALLI, status: ReportStatus.IN_PROGRESS, createdAgo: 4 * DAY,
    exams: [VITAMIN_D(26, 30, 100), CALCIUM(9.5, 8.6, 10.2)]
  },
  {
    patient: FERRI, doctor: VALLI, status: ReportStatus.FINALIZED, createdAgo: 25 * DAY, finalizedAgo: 24 * DAY,
    outcome: {
      en: 'Uric acid is slightly high, kidney function is normal. Drink at least 2 litres of water a day and limit red meat and alcohol.',
      it: 'Acido urico lievemente alto, funzione renale nella norma. Bere almeno 2 litri d’acqua al giorno e limitare carni rosse e alcol.'
    },
    exams: [CREATININE(1.1, 0.7, 1.3), UREA(38, 10, 50), URIC_ACID(7.4, 3.4, 7), SODIUM(140, 135, 145), POTASSIUM(4.3, 3.5, 5.1)]
  },
  // Waiting for more than 2 days: shows up in the statistics hint.
  {patient: CONTI, doctor: VALLI, status: ReportStatus.CREATED, createdAgo: 4 * DAY},
  {
    patient: GALLI, doctor: VALLI, status: ReportStatus.IN_PROGRESS, createdAgo: 26 * HOUR,
    exams: [VITAMIN_B12(320, 200, 900), FOLATE(2.6, 3, 17)]
  },
  {
    patient: FERRI, doctor: NERI, status: ReportStatus.FINALIZED, createdAgo: 36 * DAY, finalizedAgo: 33 * DAY,
    outcome: {
      en: 'Blood count and kidney function are normal. No action needed.',
      it: 'Emocromo e funzionalità renale nella norma. Nessun intervento necessario.'
    },
    exams: [HAEMOGLOBIN(14.8, 13, 17), WHITE_CELLS(6.2, 4, 10), PLATELETS(250, 150, 400), CREATININE(1.0, 0.7, 1.3)]
  },
  {
    patient: MORETTI, doctor: NERI, status: ReportStatus.FINALIZED, createdAgo: 34 * DAY, finalizedAgo: 31 * DAY,
    outcome: {
      en: 'Slight increase in liver enzymes (ALT). Reduce alcohol and fatty food and repeat the tests in 2 months.',
      it: 'Lieve aumento delle transaminasi (ALT). Ridurre alcol e cibi grassi e ripetere gli esami tra 2 mesi.'
    },
    exams: [AST(28, 10, 40), ALT(61, 7, 56), GAMMA_GT(48, 8, 61), BILIRUBIN(0.9, 0.3, 1.2)]
  },
  {
    patient: BIANCHI, doctor: NERI, status: ReportStatus.FINALIZED, createdAgo: 30 * DAY, finalizedAgo: 28 * DAY,
    outcome: {
      en: 'High cholesterol and triglycerides. We start with diet and exercise and will consider medication at the next check in 3 months.',
      it: 'Colesterolo e trigliceridi elevati. Iniziamo con dieta e attività fisica; valuteremo una terapia al prossimo controllo tra 3 mesi.'
    },
    exams: [CHOLESTEROL(232, null, 200), LDL(158, null, 100), HDL(44, 40, null), TRIGLYCERIDES(175, null, 150)]
  },
  {
    patient: MORETTI, doctor: NERI, status: ReportStatus.FINALIZED, createdAgo: 21 * DAY, finalizedAgo: 19 * DAY,
    outcome: {
      en: 'No signs of inflammation. Blood count is normal.',
      it: 'Nessun segno di infiammazione. Emocromo nella norma.'
    },
    exams: [CRP(0.3, null, 0.5), ESR(18, null, 20), HAEMOGLOBIN(14.1, 13, 17)]
  },
  {
    patient: CONTI, doctor: NERI, status: ReportStatus.FINALIZED, createdAgo: 17 * DAY, finalizedAgo: 15 * DAY,
    outcome: {
      en: 'Vitamin D deficiency. I am prescribing a supplement for 8 weeks, then we will repeat the test.',
      it: 'Carenza di vitamina D. Prescrivo un’integrazione per 8 settimane, poi ripeteremo il dosaggio.'
    },
    exams: [VITAMIN_D(18, 30, 100), FERRITIN(45, 30, 400), CALCIUM(9.4, 8.6, 10.2)]
  },
  {
    patient: GALLI, doctor: NERI, status: ReportStatus.FINALIZED, createdAgo: 6 * DAY, finalizedAgo: 4 * DAY,
    outcome: {
      en: 'Electrolytes and kidney function are normal. See you at the yearly check-up.',
      it: 'Elettroliti e funzionalità renale nella norma. Ci rivediamo al controllo annuale.'
    },
    exams: [SODIUM(141, 135, 145), POTASSIUM(4.6, 3.5, 5.1), CREATININE(0.9, 0.7, 1.3)]
  },
  {
    patient: COLOMBO, doctor: NERI, status: ReportStatus.IN_PROGRESS, createdAgo: 30 * HOUR,
    exams: [TSH(5.1, 0.4, 4), FT4(1.1, 0.9, 1.7)]
  },
  {
    patient: FERRI, doctor: NERI, status: ReportStatus.IN_PROGRESS, createdAgo: 8 * DAY,
    exams: [PSA(3.2, null, 4), CREATININE(1.0, 0.7, 1.3)]
  },
  {patient: GRECO, doctor: NERI, status: ReportStatus.CREATED, createdAgo: DAY},
  {patient: BIANCHI, doctor: NERI, status: ReportStatus.CREATED, createdAgo: 60 * HOUR}
];

export interface DemoDatabase {
  users: DemoUser[];
  reports: Report[];
  nextReportId: number;
  nextExamId: number;
}

/** The API sends LocalDateTime: ISO-8601 in local time, without a zone. */
export function localIso(date: Date): string {
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 19);
}

export function publicUser({password, ...user}: DemoUser): User {
  return structuredClone(user);
}

export function seedDatabase(language: Language, now: Date): DemoDatabase {
  let nextExamId = 1;
  const at = (ago: number) => localIso(new Date(now.getTime() - ago));

  const reports = SEED_REPORTS.map((seed, index): Report => {
    const seedExams = seed.exams ?? [];
    // Exams are spread evenly between creation and finalization (or now), like the backend seeder.
    const end = seed.finalizedAgo ?? 0;
    const step = (seed.createdAgo - end) / (seedExams.length + 1);
    const exams = seedExams.map((seedExam, i): Exam => ({
      id: nextExamId++,
      analysis: seedExam.analysis[language],
      unitOfMeasure: seedExam.unitOfMeasure,
      examValue: seedExam.examValue,
      refMin: seedExam.refMin,
      refMax: seedExam.refMax,
      createdAt: at(seed.createdAgo - step * (i + 1))
    }));
    const lastChange = exams.length ? exams[exams.length - 1].createdAt! : at(seed.createdAgo);
    return {
      id: index + 1,
      patient: publicUser(seed.patient),
      createdBy: publicUser(seed.doctor),
      status: seed.status,
      createdAt: at(seed.createdAgo),
      updatedAt: seed.finalizedAgo !== undefined ? at(seed.finalizedAgo) : lastChange,
      finalizedAt: seed.finalizedAgo !== undefined ? at(seed.finalizedAgo) : null,
      outcome: seed.outcome?.[language] ?? null,
      exams
    };
  });

  return {users: structuredClone([...USERS]), reports, nextReportId: reports.length + 1, nextExamId};
}
