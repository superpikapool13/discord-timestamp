import { describe, it, expect } from 'vitest';
import {
  getPartsInTimeZone,
  getOffsetMinutes,
  zonedTimeToUtc,
  getLocalTimeZone,
} from '../utils/datetimeHelpers';

describe('getOffsetMinutes', () => {
  it('returns 0 for UTC', () => {
    expect(getOffsetMinutes('UTC')).toBe(0);
  });

  it('returns 330 for Asia/Kolkata (fixed +05:30, no DST)', () => {
    expect(getOffsetMinutes('Asia/Kolkata')).toBe(330);
  });

  it('resolves a synthetic fixed-offset string directly, ignoring the date', () => {
    expect(getOffsetMinutes('UTC+05:30')).toBe(330);
    expect(getOffsetMinutes('UTC-08:00')).toBe(-480);
  });

  it('reflects DST changes across the year for a real zone (America/New_York)', () => {
    const winter = new Date('2024-01-15T12:00:00Z'); // EST, no DST
    const summer = new Date('2024-07-15T12:00:00Z'); // EDT, DST active
    expect(getOffsetMinutes('America/New_York', winter)).toBe(-300); // -5:00
    expect(getOffsetMinutes('America/New_York', summer)).toBe(-240); // -4:00
  });

  it('never changes offset for a fixed-offset Etc/GMT zone regardless of season', () => {
    const winter = new Date('2024-01-15T12:00:00Z');
    const summer = new Date('2024-07-15T12:00:00Z');
    expect(getOffsetMinutes('Etc/GMT+8', winter)).toBe(-480);
    expect(getOffsetMinutes('Etc/GMT+8', summer)).toBe(-480);
  });
});

describe('getPartsInTimeZone', () => {
  it('extracts correct wall-clock parts for UTC', () => {
    const instant = new Date('2024-06-15T14:30:45Z');
    expect(getPartsInTimeZone(instant, 'UTC')).toEqual({
      date: '2024-06-15',
      time: '14:30:45',
    });
  });

  it('extracts correct wall-clock parts for a positive-offset zone', () => {
    const instant = new Date('2024-06-15T14:30:45Z'); // 20:00:45 in IST (+5:30)
    expect(getPartsInTimeZone(instant, 'Asia/Kolkata')).toEqual({
      date: '2024-06-15',
      time: '20:00:45',
    });
  });

  it('extracts correct wall-clock parts for a negative synthetic offset', () => {
    const instant = new Date('2024-06-15T14:30:45Z');
    expect(getPartsInTimeZone(instant, 'UTC-08:00')).toEqual({
      date: '2024-06-15',
      time: '06:30:45',
    });
  });

  it('rolls over to the previous/next day correctly near midnight', () => {
    const instant = new Date('2024-06-15T01:00:00Z'); // 20:00 previous day in UTC-8
    expect(getPartsInTimeZone(instant, 'UTC-08:00')).toEqual({
      date: '2024-06-14',
      time: '17:00:00',
    });
  });
});

describe('zonedTimeToUtc', () => {
  it('round-trips correctly for UTC', () => {
    const instant = zonedTimeToUtc('2024-06-15', '14:30:45', 'UTC');
    expect(instant.toISOString()).toBe('2024-06-15T14:30:45.000Z');
  });

  it('round-trips correctly for a fixed-offset zone', () => {
    const instant = zonedTimeToUtc('2024-06-15', '20:00:00', 'Asia/Kolkata');
    expect(instant.toISOString()).toBe('2024-06-15T14:30:00.000Z');
  });

  it('round-trips correctly for a synthetic offset string', () => {
    const instant = zonedTimeToUtc('2024-06-15', '06:30:00', 'UTC-08:00');
    expect(instant.toISOString()).toBe('2024-06-15T14:30:00.000Z');
  });

  it('correctly accounts for DST when converting a summer date/time', () => {
    // 2024-07-15 10:00 in New York is EDT (-04:00) -> 14:00 UTC
    const instant = zonedTimeToUtc('2024-07-15', '10:00:00', 'America/New_York');
    expect(instant.toISOString()).toBe('2024-07-15T14:00:00.000Z');
  });

  it('correctly accounts for DST when converting a winter date/time', () => {
    // 2024-01-15 10:00 in New York is EST (-05:00) -> 15:00 UTC
    const instant = zonedTimeToUtc('2024-01-15', '10:00:00', 'America/New_York');
    expect(instant.toISOString()).toBe('2024-01-15T15:00:00.000Z');
  });

  it('is the exact inverse of getPartsInTimeZone (full round trip)', () => {
    const original = { date: '2024-03-15', time: '02:30:00' };
    const instant = zonedTimeToUtc(original.date, original.time, 'America/New_York');
    const roundTripped = getPartsInTimeZone(instant, 'America/New_York');
    expect(roundTripped).toEqual(original);
  });
});

describe('getLocalTimeZone', () => {
  it('returns a non-empty timezone string', () => {
    const zone = getLocalTimeZone();
    expect(typeof zone).toBe('string');
    expect(zone.length).toBeGreaterThan(0);
  });
});
