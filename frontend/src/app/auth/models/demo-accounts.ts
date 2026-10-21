import {UserRole} from '@app/users/models/user-role-enum';

export interface DemoAccount {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Mirrors the backend DatabaseSeeder; shown only when environment.showDemoAccounts is true. */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {name: 'Dr. Giorgio Poi', email: 'g.poi@gmail.com', password: 'doctor2', role: UserRole.DOCTOR},
  {name: 'Dr. Claudia Rossi', email: 'claudiarossi@gmail.com', password: 'doctor1', role: UserRole.DOCTOR},
  {name: 'Giuseppe Massari', email: 'g.massari@gmail.com', password: 'patient1', role: UserRole.PATIENT},
  {name: 'Luisa Spagnoli', email: 'spagnoli.luisa@libero.it', password: 'patient2', role: UserRole.PATIENT}
];
