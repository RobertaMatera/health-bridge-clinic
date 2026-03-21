import {Routes} from '@angular/router';
import {authenticatedGuard} from './auth/guards/authenticated-guard';
import {roleGuard} from './auth/guards/role-guard';
import {UserRole} from './users/models/user-role-enum';

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
  loadComponent: () => import('./auth/pages/login-page/login-page').then(m => m.LoginPage)
}, {
  path: 'unauthorized',
  loadComponent: () => import('./auth/pages/unauthorized-page/unauthorized-page').then(m => m.UnauthorizedPage)
}];
