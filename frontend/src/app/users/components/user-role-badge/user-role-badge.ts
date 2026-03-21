import {Component, input} from '@angular/core';
import {UserRole} from '@app/users/models/user-role-enum';

@Component({
  selector: 'app-user-role-badge',
  imports: [],
  templateUrl: './user-role-badge.html'
})
export class UserRoleBadge {
  role = input.required<string>();

  badgeClass() {
    switch (this.role()) {
      case UserRole.PATIENT:
        return 'badge-green';
      case UserRole.DOCTOR:
        return 'badge-blue';
      default:
        return 'badge-gray';
    }
  }

  badgeLabel(): string {
    switch (this.role()) {
      case UserRole.PATIENT:
        return 'Paziente';
      case UserRole.DOCTOR:
        return 'Dottore';
      default:
        return '';
    }
  }
}
