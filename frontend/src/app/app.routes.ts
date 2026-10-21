import {Routes} from '@angular/router';
import {authenticatedGuard} from './auth/guards/authenticated-guard';
import {roleGuard} from './auth/guards/role-guard';
import {guestGuard} from './auth/guards/guest-guard';
import {UserRole} from './users/models/user-role-enum';
// Eager on purpose: they must still render when lazy chunks cannot be fetched.
import {ErrorPage} from './commons/pages/error-page/error-page';
import {NotFoundPage} from './commons/pages/not-found-page/not-found-page';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'reports'
}, {
  path: 'reports',
  canActivate: [authenticatedGuard],
  children: [{
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./reports/pages/reports-page/reports-page').then(m => m.ReportsPage)
  }, {
    path: 'create',
    loadComponent: () => import('./reports/pages/create-report-page/create-report-page').then(m => m.CreateReportPage),
    canActivate: [roleGuard],
    data: {
      requiredRole: UserRole.DOCTOR
    }
  }, {
    path: ':id',
    loadComponent: () => import('./reports/pages/report-page/report-page').then(m => m.ReportPage)
  }]
}, {
  path: 'analytics',
  loadComponent: () => import('./analytics/pages/analytics-page/analytics-page').then(m => m.AnalyticsPage),
  canActivate: [authenticatedGuard, roleGuard],
  data: {
    requiredRole: UserRole.DOCTOR
  }
}, {
  path: 'login',
  canActivate: [guestGuard],
  loadComponent: () => import('./auth/pages/login-page/login-page').then(m => m.LoginPage)
}, {
  path: 'unauthorized',
  loadComponent: () => import('./auth/pages/unauthorized-page/unauthorized-page').then(m => m.UnauthorizedPage)
}, {
  path: 'error',
  component: ErrorPage
}, {
  path: '**',
  component: NotFoundPage
}];
