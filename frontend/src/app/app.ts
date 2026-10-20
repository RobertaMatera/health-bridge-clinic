import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from './commons/components/navbar/navbar';
import {ToastOutlet} from '@app/commons/ui/toast/toast-outlet';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    ToastOutlet
  ],
  templateUrl: './app.html'
})
export class App {
}
