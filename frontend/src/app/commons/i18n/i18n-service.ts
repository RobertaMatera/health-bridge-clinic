import {computed, effect, Injectable, signal} from '@angular/core';
import {en} from '@app/commons/i18n/dictionaries/en';
import {it} from '@app/commons/i18n/dictionaries/it';
import {
  Dictionary,
  Language,
  LANGUAGES,
  PluralForms,
  TranslationKey,
  TranslationParams
} from '@app/commons/i18n/i18n-types';

const STORAGE_KEY = 'hbc.language';

const DICTIONARIES: Record<Language, Dictionary> = {en, it};

const LOCALES: Record<Language, string> = {en: 'en-GB', it: 'it-IT'};

export type DateStyle = 'date' | 'dateShort' | 'dateTime' | 'dateLong' | 'weekdayLong' | 'time' | 'dayMonth';

const DATE_FORMATS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  date: {day: 'numeric', month: 'short', year: 'numeric'},
  dateShort: {day: 'numeric', month: 'short'},
  dateTime: {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'},
  dateLong: {day: 'numeric', month: 'long', year: 'numeric'},
  weekdayLong: {weekday: 'long', day: 'numeric', month: 'long'},
  time: {hour: '2-digit', minute: '2-digit'},
  dayMonth: {day: 'numeric', month: 'short'}
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  readonly language = signal<Language>(initialLanguage());
  readonly locale = computed(() => LOCALES[this.language()]);

  private readonly pluralRules = computed(() => new Intl.PluralRules(this.locale()));

  constructor() {
    effect(() => {
      const language = this.language();
      document.documentElement.lang = language;
      try {
        localStorage.setItem(STORAGE_KEY, language);
      } catch {
        // Storage can be unavailable (private mode); the choice then lasts for this session only.
      }
    });
  }

  setLanguage(language: Language): void {
    this.language.set(language);
  }

  t(key: TranslationKey, params?: TranslationParams): string {
    const value = lookup(DICTIONARIES[this.language()], key);
    const text = typeof value === 'string' ? value : this.plural(value, params);
    return interpolate(text, params);
  }

  formatDate(value: Date | string | null | undefined, style: DateStyle = 'date'): string {
    if (!value) {
      return '';
    }
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat(this.locale(), DATE_FORMATS[style]).format(date);
  }

  formatNumber(value: number | null | undefined, options?: Intl.NumberFormatOptions): string {
    if (value === null || value === undefined) {
      return '';
    }
    return new Intl.NumberFormat(this.locale(), options).format(value);
  }

  private plural(forms: PluralForms, params?: TranslationParams): string {
    const count = Number(params?.['count'] ?? 0);
    return this.pluralRules().select(count) === 'one' ? forms.one : forms.other;
  }
}

function initialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGUAGES as readonly string[]).includes(stored)) {
      return stored as Language;
    }
  } catch {
    // Fall back to the browser language below.
  }
  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}

function lookup(dictionary: Dictionary, key: TranslationKey): string | PluralForms {
  let node: unknown = dictionary;
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part];
  }
  return node as string | PluralForms;
}

function interpolate(text: string, params?: TranslationParams): string {
  if (!params) {
    return text;
  }
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}
