import {Exam} from '@app/exams/models/exam-model';
import {TranslationKey} from '@app/commons/i18n/i18n-types';

export type ExamFlag = 'LOW' | 'HIGH' | 'BORDERLINE' | 'NORMAL' | 'NONE';

type RangedValue = Pick<Exam, 'examValue' | 'refMin' | 'refMax'>;

/** In range but within this share of the interval (or of the single bound) from a limit. */
export const BORDERLINE_MARGIN = 0.05;

export function evaluateExam({examValue, refMin, refMax}: RangedValue): ExamFlag {
  const min = refMin ?? null;
  const max = refMax ?? null;

  if (min === null && max === null) {
    return 'NONE';
  }
  if (min !== null && examValue < min) {
    return 'LOW';
  }
  if (max !== null && examValue > max) {
    return 'HIGH';
  }

  const margin = min !== null && max !== null
    ? (max - min) * BORDERLINE_MARGIN
    : Math.abs((max ?? min)!) * BORDERLINE_MARGIN;
  const nearMin = min !== null && examValue - min <= margin;
  const nearMax = max !== null && max - examValue <= margin;
  return nearMin || nearMax ? 'BORDERLINE' : 'NORMAL';
}

export function isOutOfRange(exam: RangedValue): boolean {
  const flag = evaluateExam(exam);
  return flag === 'LOW' || flag === 'HIGH';
}

export function countOutOfRange(exams: readonly RangedValue[] | undefined): number {
  return (exams ?? []).filter(isOutOfRange).length;
}

export function flagKey(flag: ExamFlag): TranslationKey {
  return `flags.${flag}`;
}

export function flagClass(flag: ExamFlag): string {
  switch (flag) {
    case 'LOW':
    case 'HIGH':
      return 'flag-out';
    case 'BORDERLINE':
      return 'flag-borderline';
    case 'NORMAL':
      return 'flag-normal';
    default:
      return 'flag-none';
  }
}

/** Reference range as "70–99", "< 200" or "> 40"; empty when there is none. */
export function formatRange({refMin, refMax}: Pick<Exam, 'refMin' | 'refMax'>, format: (value: number) => string): string {
  const min = refMin ?? null;
  const max = refMax ?? null;
  if (min !== null && max !== null) {
    return `${format(min)}–${format(max)}`;
  }
  if (max !== null) {
    return `< ${format(max)}`;
  }
  if (min !== null) {
    return `> ${format(min)}`;
  }
  return '';
}

export interface RangeBar {
  /** Start and end of the in-range segment, in % of the bar. */
  okStart: number;
  okEnd: number;
  /** Position of the value marker, in % of the bar (clamped to stay visible). */
  marker: number;
}

/**
 * Lays the reference interval and the value on a common scale. Two-sided ranges get half a
 * span of margin on each side; one-sided ranges are drawn from 0 to twice the bound.
 */
export function rangeBar({examValue, refMin, refMax}: RangedValue): RangeBar | null {
  const min = refMin ?? null;
  const max = refMax ?? null;
  if (min === null && max === null) {
    return null;
  }

  let start: number;
  let end: number;
  if (min !== null && max !== null) {
    const pad = (max - min || Math.abs(max) || 1) / 2;
    start = min - pad;
    end = max + pad;
  } else {
    const bound = (max ?? min)!;
    start = 0;
    end = Math.abs(bound) * 2 || 1;
  }
  const toPercent = (value: number) => Math.min(100, Math.max(0, ((value - start) / (end - start)) * 100));

  return {
    okStart: min !== null ? toPercent(min) : 0,
    okEnd: max !== null ? toPercent(max) : 100,
    marker: Math.min(97, Math.max(3, toPercent(examValue)))
  };
}
