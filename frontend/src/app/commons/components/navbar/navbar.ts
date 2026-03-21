import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '@app/auth/services/auth-service';
import {Logo} from '@app/commons/components/logo/logo';
import {UserBadge} from '@app/users/components/user-badge/user-badge';
import {UserRoleBadge} from '@app/users/components/user-role-badge/user-role-badge';
import {HasRole} from '@app/auth/directives/has-role-directive';
import {UserRole} from '@app/users/models/user-role-enum';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    Logo,
    RouterLinkActive,
    UserBadge,
    UserRoleBadge,
    HasRole
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  UserRole = UserRole;

  authService = inject(AuthService);

  loggedIn = this.authService.isLoggedIn;
  user = this.authService.user;
  menuOpen = signal(false);


  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}
