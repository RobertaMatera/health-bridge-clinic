import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AnalyticsService} from '@app/analytics/services/analytics-service';
import {Analytics} from '@app/analytics/models/analytics-model';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {TranslatePipe} from '@app/commons/i18n/translate-pipe';
import {LocalNumberPipe} from '@app/commons/i18n/local-number-pipe';
import {TranslationKey} from '@app/commons/i18n/i18n-types';
import {EmptyState} from '@app/commons/ui/empty-state/empty-state';

type LoadState = 'loading' | 'ready' | 'error';

const MINUTES_PER_DAY = 24 * 60;

interface StatusSlice {
  key: TranslationKey;
  count: number;
  share: number;
  fill: string;
}

/** Clinic statistics drawn with plain HTML/CSS: every chart has a text equivalent. */
@Component({
  selector: 'app-analytics-page',
  imports: [TranslatePipe, LocalNumberPipe, EmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-page.html'
})
export class AnalyticsPage {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject(I18nService);

  protected readonly analytics = signal<Analytics | null>(null);
  protected readonly state = signal<LoadState>('loading');

  /** Average time to finalize, in days from one day up, otherwise in hours. */
  protected readonly averageTime = computed(() => {
    const minutes = this.analytics()?.averageMinutesInProgress;
    if (minutes === null || minutes === undefined) {
      return null;
    }
    if (minutes >= MINUTES_PER_DAY) {
      const days = Math.round((minutes / MINUTES_PER_DAY) * 10) / 10;
      return {value: days, unit: 'analytics.days' as const};
    }
    return {value: Math.max(1, Math.round(minutes / 60)), unit: 'analytics.hours' as const};
  });

  protected readonly weeks = computed(() => {
    const weeks = this.analytics()?.reportsPerWeek ?? [];
    const max = Math.max(1, ...weeks.map(week => week.count));
    return weeks.map((week, index) => ({
      ...week,
      label: this.i18n.formatDate(`${week.weekStart}T00:00:00`, 'dayMonth'),
      height: (week.count / max) * 100,
      current: index === weeks.length - 1
    }));
  });

  protected readonly weeklyAria = computed(() =>
    this.weeks().map(week => `${week.label}: ${week.count}`).join(', '));

  protected readonly statusSlices = computed<StatusSlice[]>(() => {
    const analytics = this.analytics();
    if (!analytics) {
      return [];
    }
    const total = analytics.totalReports || 1;
    return [
      {key: 'analytics.legendCreated', count: analytics.createdReports, fill: 'bg-chart-created'},
      {key: 'analytics.legendProgress', count: analytics.inProgressReports, fill: 'bg-chart-progress'},
      {key: 'analytics.legendFinal', count: analytics.finalizedReports, fill: 'bg-chart-final'}
    ].map(slice => ({...slice, share: Math.round((slice.count / total) * 100)})) as StatusSlice[];
  });

  protected readonly userShares = computed(() => {
    const analytics = this.analytics();
    const max = Math.max(1, analytics?.totalDoctors ?? 0, analytics?.totalPatients ?? 0);
    return {
      doctors: ((analytics?.totalDoctors ?? 0) / max) * 100,
      patients: ((analytics?.totalPatients ?? 0) / max) * 100
    };
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.state.set('loading');
    this.analyticsService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: analytics => {
          this.analytics.set(analytics);
          this.state.set('ready');
        },
        error: () => this.state.set('error')
      });
  }
}
