import {AfterViewInit, Directive, ElementRef, input} from '@angular/core';
import {AuthService} from '@app/auth/services/auth-service';
import {UserRole} from '@app/users/models/user-role-enum';

export enum HasRoleAction {
  HIDE = 'hide',
  DISABLE = 'disable'
}

@Directive({selector: '[appHasRole]'})
export class HasRole implements AfterViewInit {

  appHasRole = input<UserRole | null>(null);
  action = input<HasRoleAction>(HasRoleAction.HIDE);

  constructor(
    private readonly authService: AuthService,
    private readonly elementRef: ElementRef
  ) {
  }

  ngAfterViewInit(): void {
    const requiredRole = this.appHasRole();

    if (!requiredRole) {
      return;
    }

    if (!this.authService.hasRole(requiredRole)) {
      const nativeElement: HTMLElement = this.elementRef.nativeElement;

      switch (this.action()) {
        case HasRoleAction.HIDE:
          nativeElement.remove();
          break;
        case HasRoleAction.DISABLE:
          nativeElement.setAttribute('disabled', 'true');
          break;
      }
    }
  }
}
