import {UserRole} from '@app/users/models/user-role-enum';

export interface DemoAccount {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Mirrors the backend DatabaseSeeder; shown only when environment.showDemoAccounts is true. */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {name: 'Dr. Giorgio Poi', email: 'g.poi@healthbridge.test', password: 'doctor2', role: UserRole.DOCTOR},
  {name: 'Dr. Claudia Rossi', email: 'claudiarossi@healthbridge.test', password: 'doctor1', role: UserRole.DOCTOR},
  {name: 'Giuseppe Massari', email: 'g.massari@healthbridge.test', password: 'patient1', role: UserRole.PATIENT},
  {name: 'Luisa Spagnoli', email: 'spagnoli.luisa@healthbridge.test', password: 'patient2', role: UserRole.PATIENT},
  {name: 'Anna Colombo', email: 'a.colombo@healthbridge.test', password: 'patient3', role: UserRole.PATIENT},
  {name: 'Marco Ferri', email: 'm.ferri@healthbridge.test', password: 'patient4', role: UserRole.PATIENT},
  {name: 'Sara Greco', email: 's.greco@healthbridge.test', password: 'patient5', role: UserRole.PATIENT},
  {name: 'Paolo Bianchi', email: 'p.bianchi@healthbridge.test', password: 'patient6', role: UserRole.PATIENT}
];
