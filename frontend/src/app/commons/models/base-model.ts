import {User} from '@app/users/models/user-model';

/** Timestamps arrive from the API as ISO-8601 strings (LocalDateTime, no zone). */
export interface BaseModel {
  id?: number;
  createdAt?: string;
  createdBy?: User;
  updatedAt?: string;
}
