import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Navbar} from './commons/components/navbar/navbar';
import {AlertsService} from './commons/services/alerts-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar
  ],
  templateUrl: './app.html'
})
export class App implements OnInit, OnDestroy {
  alertsService = inject(AlertsService);
  router = inject(Router);
  routerSubscription?: Subscription;

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(() => this.clearAlerts());
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  clearAlerts() {
    this.alertsService.clear();
  }
}
