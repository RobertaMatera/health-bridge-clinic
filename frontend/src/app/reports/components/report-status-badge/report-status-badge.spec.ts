import {TestBed} from '@angular/core/testing';
import {ReportStatusBadge} from '@app/reports/components/report-status-badge/report-status-badge';
import {ReportStatus} from '@app/reports/models/report-status-enum';
import {I18nService} from '@app/commons/i18n/i18n-service';

describe('ReportStatusBadge', () => {
  function render(status: ReportStatus, audience: 'doctor' | 'patient' = 'doctor'): HTMLElement {
    const fixture = TestBed.createComponent(ReportStatusBadge);
    fixture.componentRef.setInput('status', status);
    fixture.componentRef.setInput('audience', audience);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.badge');
  }

  beforeEach(() => {
    TestBed.inject(I18nService).setLanguage('en');
  });

  it('pairs each status with its own colour class and a text label', () => {
    expect(render(ReportStatus.CREATED)).toHaveProperty('className', expect.stringContaining('badge-created'));
    expect(render(ReportStatus.IN_PROGRESS).className).toContain('badge-progress');

    const finalized = render(ReportStatus.FINALIZED);
    expect(finalized.className).toContain('badge-final');
    expect(finalized.textContent?.trim()).toBe('Finalized');
  });

  it('uses plain language for patients', () => {
    expect(render(ReportStatus.FINALIZED, 'patient').textContent?.trim()).toBe('Ready');
  });

  it('follows the selected language', () => {
    TestBed.inject(I18nService).setLanguage('it');
    expect(render(ReportStatus.IN_PROGRESS).textContent?.trim()).toBe('In lavorazione');
  });
});
