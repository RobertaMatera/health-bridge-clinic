import {countOutOfRange, evaluateExam, formatRange, isOutOfRange, rangeBar} from '@app/exams/models/exam-range';

const exam = (examValue: number, refMin: number | null, refMax: number | null) => ({examValue, refMin, refMax});

describe('evaluateExam', () => {
  it('returns NONE without a reference range', () => {
    expect(evaluateExam(exam(5, null, null))).toBe('NONE');
  });

  it('flags values below the minimum as LOW and above the maximum as HIGH', () => {
    expect(evaluateExam(exam(12.9, 13, 17))).toBe('LOW');
    expect(evaluateExam(exam(17.1, 13, 17))).toBe('HIGH');
  });

  it('treats the bounds themselves as in range', () => {
    expect(evaluateExam(exam(13, 13, 17))).not.toBe('LOW');
    expect(evaluateExam(exam(17, 13, 17))).not.toBe('HIGH');
  });

  it('flags values within 5% of the interval from a bound as BORDERLINE', () => {
    // Interval 70-99: margin 1.45
    expect(evaluateExam(exam(98, 70, 99))).toBe('BORDERLINE');
    expect(evaluateExam(exam(71, 70, 99))).toBe('BORDERLINE');
    expect(evaluateExam(exam(85, 70, 99))).toBe('NORMAL');
  });

  it('uses 5% of the bound for one-sided ranges', () => {
    // "< 200": margin 10
    expect(evaluateExam(exam(200, null, 200))).toBe('BORDERLINE');
    expect(evaluateExam(exam(195, null, 200))).toBe('BORDERLINE');
    expect(evaluateExam(exam(180, null, 200))).toBe('NORMAL');
    expect(evaluateExam(exam(201, null, 200))).toBe('HIGH');
    // "> 40": margin 2
    expect(evaluateExam(exam(41, 40, null))).toBe('BORDERLINE');
    expect(evaluateExam(exam(50, 40, null))).toBe('NORMAL');
    expect(evaluateExam(exam(39, 40, null))).toBe('LOW');
  });

  it('counts only LOW and HIGH as out of range', () => {
    expect(isOutOfRange(exam(200, null, 200))).toBe(false);
    expect(isOutOfRange(exam(120, null, 100))).toBe(true);
    expect(countOutOfRange([exam(120, null, 100), exam(50, 40, null), exam(3, 4, 10), exam(1, null, null)])).toBe(2);
    expect(countOutOfRange(undefined)).toBe(0);
  });
});

describe('formatRange', () => {
  const format = (value: number) => String(value);

  it('formats two-sided and one-sided ranges', () => {
    expect(formatRange(exam(0, 70, 99), format)).toBe('70–99');
    expect(formatRange(exam(0, null, 200), format)).toBe('< 200');
    expect(formatRange(exam(0, 40, null), format)).toBe('> 40');
    expect(formatRange(exam(0, null, null), format)).toBe('');
  });
});

describe('rangeBar', () => {
  it('returns null without a reference range', () => {
    expect(rangeBar(exam(1, null, null))).toBeNull();
  });

  it('places a two-sided interval in the middle half of the bar', () => {
    const bar = rangeBar(exam(15, 13, 17))!;
    expect(bar.okStart).toBeCloseTo(25);
    expect(bar.okEnd).toBeCloseTo(75);
    expect(bar.marker).toBeCloseTo(50);
  });

  it('keeps the marker visible for extreme values', () => {
    expect(rangeBar(exam(1000, 13, 17))!.marker).toBe(97);
    expect(rangeBar(exam(-1000, 13, 17))!.marker).toBe(3);
  });

  it('draws one-sided ranges from zero', () => {
    const bar = rangeBar(exam(100, null, 200))!;
    expect(bar.okStart).toBe(0);
    expect(bar.okEnd).toBeCloseTo(50);
  });
});
