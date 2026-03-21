import {Component, input, signal} from '@angular/core';
import {User} from '@app/users/models/user-model';

/**
 * Random avatars from https://www.untitledui.com/avatars
 */
@Component({
  selector: 'app-user-badge',
  imports: [],
  templateUrl: './user-badge.html'
})
export class UserBadge {
  user = input.required<User>();
  avatarUrl = signal<string>(this.randomAvatar());

  randomAvatar() {
    const avatarsCount = 40;
    const randomIndex = Math.floor(Math.random() * (avatarsCount - 1)) + 1;
    const filename = `${randomIndex}`.padStart(3, '0');
    return `avatars/${filename}.jpg`;
  }
}
