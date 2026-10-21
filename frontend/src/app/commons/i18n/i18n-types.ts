import type {en} from '@app/commons/i18n/dictionaries/en';

export type Language = 'en' | 'it';

export const LANGUAGES: readonly Language[] = ['en', 'it'];

/** Plural variants, picked with Intl.PluralRules from the `count` parameter. */
export interface PluralForms {
  one: string;
  other: string;
}

/** Shape every dictionary must match: the English one is the source of truth. */
export type Dictionary = typeof en;

type KeyPaths<T> = {
  [K in keyof T & string]: T[K] extends string | PluralForms ? K : `${K}.${KeyPaths<T[K]>}`;
}[keyof T & string];

/** Every valid dotted key, e.g. 'reports.list.title'. A typo is a compile error. */
export type TranslationKey = KeyPaths<Dictionary>;

export type TranslationParams = Record<string, string | number>;
