import {Injectable, signal} from '@angular/core';

export enum AlertType {
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning'
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  infoMessage = signal<string | null>(null);
  warningMessage = signal<string | null>(null);
  timeout?: number;

  showAlert(message: string, type: AlertType): void {
    switch (type) {
      case AlertType.ERROR:
        this.errorMessage.set(message);
        break;
      case AlertType.SUCCESS:
        this.successMessage.set(message);
        break;
      case AlertType.INFO:
        this.infoMessage.set(message);
        break;
      case AlertType.WARNING:
        this.warningMessage.set(message);
        break;
    }

    if (type !== AlertType.ERROR) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.clear(), 5000);
    }
  }

  clear() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.infoMessage.set(null);
    this.warningMessage.set(null);
  }
}
