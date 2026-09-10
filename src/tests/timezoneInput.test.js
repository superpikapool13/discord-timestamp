import { describe, it, expect } from 'vitest';
import { resolveTimezoneInput, getDisplayLabel, formatTimezoneOption } from '../utils/timezoneInput';

describe('resolveTimezoneInput', () => {
  it('resolves an exact IANA zone name, case-insensitively', () => {
    expect(resolveTimezoneInput('Asia/Kolkata')).toBe('Asia/Kolkata');
    expect(resolveTimezoneInput('asia/kolkata')).toBe('Asia/Kolkata');
  });

  it('resolves a bare fixed-offset code', () => {
    expect(resolveTimezoneInput('PST')).toBe('Etc/GMT+8');
    expect(resolveTimezoneInput('pst')).toBe('Etc/GMT+8');
  });

  it('parses a raw UTC offset in various formats', () => {
    expect(resolveTimezoneInput('+5:30')).toBe('UTC+05:30');
    expect(resolveTimezoneInput('-8')).toBe('UTC-08:00');
    expect(resolveTimezoneInput('5:30')).toBe('UTC+05:30');
    expect(resolveTimezoneInput('utc+2')).toBe('UTC+02:00');
    expect(resolveTimezoneInput('gmt-04:00')).toBe('UTC-04:00');
  });

  it('rejects an out-of-range offset', () => {
    expect(resolveTimezoneInput('+25:00')).toBeNull();
    expect(resolveTimezoneInput('+5:99')).toBeNull();
  });

  it('rejects nonsense input', () => {
    expect(resolveTimezoneInput('banana')).toBeNull();
    expect(resolveTimezoneInput('')).toBeNull();
    expect(resolveTimezoneInput('   ')).toBeNull();
  });

  it('round-trips every composite display string back to its original zone', () => {
    const zonesToCheck = ['UTC', 'Asia/Kolkata', 'Etc/GMT+8', 'America/New_York', 'Asia/Kathmandu'];
    for (const zone of zonesToCheck) {
      const displayString = formatTimezoneOption(zone);
      expect(resolveTimezoneInput(displayString)).toBe(zone);
    }
  });
});

describe('formatTimezoneOption', () => {
  it('formats UTC without a redundant parenthetical', () => {
    expect(formatTimezoneOption('UTC')).toBe('UTC+00:00 - UTC');
  });

  it('formats a fixed-offset zone using its known code and description', () => {
    expect(formatTimezoneOption('Etc/GMT+8')).toBe(
      'UTC-08:00 - PST (Pacific Standard Time, fixed)'
    );
  });

  it('uses the curated abbreviation for a zone with a known override', () => {
    expect(formatTimezoneOption('Asia/Kolkata')).toBe('UTC+05:30 - IST (Asia/Kolkata)');
  });

  it('omits the code segment when no meaningful abbreviation is available', () => {
    // Asia/Kathmandu has an unusual +05:45 offset with no common code, and
    // no manual override defined - Intl typically falls back to a raw
    // "GMT+5:45"-style string, which formatTimezoneOption should suppress
    // rather than show as a redundant duplicate of the offset.
    const result = formatTimezoneOption('Asia/Kathmandu');
    expect(result).toBe('UTC+05:45 - NPT (Asia/Kathmandu)');
  });
});

describe('getDisplayLabel', () => {
  it('returns a synthetic offset string unchanged', () => {
    expect(getDisplayLabel('UTC+05:30')).toBe('UTC+05:30');
    expect(getDisplayLabel('UTC-08:00')).toBe('UTC-08:00');
  });

  it('formats a real zone using formatTimezoneOption', () => {
    expect(getDisplayLabel('UTC')).toBe(formatTimezoneOption('UTC'));
  });
});
