import {TestBed} from '@angular/core/testing';
import {I18nService} from '@app/commons/i18n/i18n-service';
import {en} from '@app/commons/i18n/dictionaries/en';
import {it as italian} from '@app/commons/i18n/dictionaries/it';

describe('I18nService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function create(): I18nService {
    const service = TestBed.inject(I18nService);
    TestBed.tick();
    return service;
  }

  it('defaults to Italian when the browser language is Italian', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('it-IT');
    expect(create().language()).toBe('it');
  });

  it('defaults to English for any other browser language', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');
    expect(create().language()).toBe('en');
  });

  it('prefers the stored choice over the browser language', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    localStorage.setItem('hbc.language', 'it');
    expect(create().language()).toBe('it');
  });

  it('switches language at runtime, persists it and updates <html lang>', () => {
    const service = create();
    service.setLanguage('it');
    TestBed.tick();

    expect(service.t('nav.reports')).toBe('Referti');
    expect(localStorage.getItem('hbc.language')).toBe('it');
    expect(document.documentElement.lang).toBe('it');

    service.setLanguage('en');
    TestBed.tick();
    expect(service.t('nav.reports')).toBe('Reports');
    expect(document.documentElement.lang).toBe('en');
  });

  it('interpolates parameters', () => {
    const service = create();
    service.setLanguage('en');
    expect(service.t('reports.create.created', {id: 7})).toBe('Report #7 created');
  });

  it('selects plural forms from the count', () => {
    const service = create();
    service.setLanguage('en');
    expect(service.t('reports.list.exams', {count: 1})).toBe('1 exam');
    expect(service.t('reports.list.exams', {count: 3})).toBe('3 exams');
    service.setLanguage('it');
    expect(service.t('reports.list.exams', {count: 1})).toBe('1 esame');
    expect(service.t('reports.list.exams', {count: 0})).toBe('0 esami');
  });

  it('formats dates and numbers for the current locale', () => {
    const service = create();
    service.setLanguage('it');
    expect(service.formatNumber(14.2)).toBe('14,2');
    expect(service.formatDate('2026-10-20T09:00:00', 'dateLong')).toBe('20 ottobre 2026');
    service.setLanguage('en');
    expect(service.formatNumber(14.2)).toBe('14.2');
    expect(service.formatDate('2026-10-20T09:00:00', 'dateLong')).toBe('20 October 2026');
  });

  it('keeps the Italian dictionary in sync with the English one', () => {
    const keys = (node: object, prefix = ''): string[] =>
      Object.entries(node).flatMap(([key, value]) =>
        typeof value === 'string' || 'one' in value ? [prefix + key] : keys(value, `${prefix}${key}.`));
    expect(keys(italian)).toEqual(keys(en));
  });
});
