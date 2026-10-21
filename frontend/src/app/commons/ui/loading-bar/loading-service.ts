import {computed, Injectable, signal} from '@angular/core';

/** Tracks in-flight HTTP requests and router navigations for the global loading bar. */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly requests = signal(0);
  private readonly navigating = signal(false);

  readonly busy = computed(() => this.navigating() || this.requests() > 0);

  requestStarted(): void {
    this.requests.update(count => count + 1);
  }

  requestEnded(): void {
    this.requests.update(count => Math.max(0, count - 1));
  }

  setNavigating(navigating: boolean): void {
    this.navigating.set(navigating);
  }
}
