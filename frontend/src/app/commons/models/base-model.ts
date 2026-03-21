import {User} from '@app/users/models/user-model';

export interface BaseModel {
  id?: number;
  createdAt?: Date;
  createdBy?: User;
  updateAt?: Date;
}
