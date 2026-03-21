import {BaseModel} from '@app/commons/models/base-model';
import {UserRole} from './user-role-enum';

export interface User extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
