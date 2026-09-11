import { describe, expect, it } from 'vitest';
import {
  apodToday,
  dayNumber,
  firstWeekday,
  hoursUntilNextApod,
  isValidApodDate,
  isValidMonth,
  monthRange,
  officialApodUrl,
  plateCode,
  randomApodDate,
  shiftDay,
  shiftMonth,
} from '../date';

describe('APOD dates', () => {
  it('computes today in US Eastern time, not UTC', () => {
    // 02:30 UTC on 12 Sep is still 22:30 on 11 Sep in New York (EDT).
    expect(apodToday(new Date('2026-09-12T02:30:00Z'))).toBe('2026-09-11');
    expect(apodToday(new Date('2026-09-12T04:30:00Z'))).toBe('2026-09-12');
  });

  it('counts hours until the next Eastern midnight', () => {
    expect(hoursUntilNextApod(new Date('2026-09-12T02:30:00Z'))).toBe(2); // 22:30 EDT
    expect(hoursUntilNextApod(new Date('2026-09-11T04:00:00Z'))).toBe(24); // 00:00 EDT
  });

  it('accepts only real dates inside the archive', () => {
    const today = '2026-09-11';
    expect(isValidApodDate('1995-06-16', today)).toBe(true);
    expect(isValidApodDate('2026-09-11', today)).toBe(true);
    expect(isValidApodDate('1995-06-15', today)).toBe(false);
    expect(isValidApodDate('2026-09-12', today)).toBe(false);
    expect(isValidApodDate('2026-02-30', today)).toBe(false);
    expect(isValidApodDate('2026-9-1', today)).toBe(false);
    expect(isValidApodDate(undefined, today)).toBe(false);
  });

  it('shifts days and months across boundaries', () => {
    expect(shiftDay('2024-02-28', 1)).toBe('2024-02-29');
    expect(shiftDay('2026-01-01', -1)).toBe('2025-12-31');
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2025-12', 1)).toBe('2026-01');
  });

  it('clamps month ranges to the archive', () => {
    expect(monthRange('1995-06', '2026-09-11')).toEqual({ start: '1995-06-16', end: '1995-06-30' });
    expect(monthRange('2026-09', '2026-09-11')).toEqual({ start: '2026-09-01', end: '2026-09-11' });
    expect(isValidMonth('1995-05', '2026-09-11')).toBe(false);
    expect(isValidMonth('2026-10', '2026-09-11')).toBe(false);
  });

  it('numbers days from the first APOD', () => {
    expect(dayNumber('1995-06-16')).toBe(1);
    expect(dayNumber('1995-06-17')).toBe(2);
  });

  it('builds official page URLs and plate codes', () => {
    expect(officialApodUrl('2026-09-11')).toBe('https://apod.nasa.gov/apod/ap260911.html');
    expect(plateCode('1999-02-19')).toBe('AP990219');
  });

  it('keeps random dates inside the archive', () => {
    expect(randomApodDate('2026-09-11', () => 0)).toBe('1995-06-16');
    expect(randomApodDate('2026-09-11', () => 0.999999)).toBe('2026-09-11');
  });

  it('finds the Monday-first weekday of the 1st', () => {
    expect(firstWeekday('2026-09')).toBe(1); // 1 Sep 2026 is a Tuesday
    expect(firstWeekday('2024-01')).toBe(0); // Monday
  });
});
