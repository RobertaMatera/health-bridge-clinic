import {User} from '@app/users/models/user-model';
import {UserRole} from '@app/users/models/user-role-enum';
import {TranslationKey} from '@app/commons/i18n/i18n-types';

export function fullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`;
}

export function roleKey(role: UserRole): TranslationKey {
  return `roles.${role}`;
}
