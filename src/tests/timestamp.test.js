import { describe, it, expect } from 'vitest';
import { getFormattedOutputs } from '../utils/timestamp';

describe('getFormattedOutputs', () => {
  // A fixed point in time, specified in UTC to avoid any DST ambiguity.
  const formats = getFormattedOutputs('2024-06-15', '14:30:00', 'UTC');
  const expectedUnix = Math.floor(Date.UTC(2024, 5, 15, 14, 30, 0) / 1000);

  function findFormat(id) {
    return formats.find((f) => f.id === id);
  }

  it('produces exactly 10 format rows', () => {
    expect(formats).toHaveLength(10);
  });

  it('computes the correct Unix timestamp', () => {
    expect(findFormat('unix').code).toBe(String(expectedUnix));
  });

  it('generates correct Discord tags for every flag', () => {
    expect(findFormat('short-time').code).toBe(`<t:${expectedUnix}:t>`);
    expect(findFormat('long-time').code).toBe(`<t:${expectedUnix}:T>`);
    expect(findFormat('short-date').code).toBe(`<t:${expectedUnix}:d>`);
    expect(findFormat('long-date').code).toBe(`<t:${expectedUnix}:D>`);
    expect(findFormat('short-datetime').code).toBe(`<t:${expectedUnix}:f>`);
    expect(findFormat('long-datetime').code).toBe(`<t:${expectedUnix}:F>`);
    expect(findFormat('relative').code).toBe(`<t:${expectedUnix}:R>`);
  });

  it('produces a correct, millisecond-free ISO 8601 UTC string', () => {
    expect(findFormat('iso-utc').code).toBe('2024-06-15T14:30:00Z');
  });

  it('produces a correct ISO 8601 string with the selected zone offset', () => {
    // Selected timezone is UTC itself, so offset should be +00:00
    expect(findFormat('iso-offset').code).toBe('2024-06-15T14:30:00+00:00');
  });

  it('reflects the selected timezone offset in the ISO offset format, not UTC', () => {
    const istFormats = getFormattedOutputs('2024-06-15', '20:00:00', 'Asia/Kolkata');
    const isoOffset = istFormats.find((f) => f.id === 'iso-offset').code;
    // Wall-clock values are used as-typed, with that zone's own offset appended
    expect(isoOffset).toBe('2024-06-15T20:00:00+05:30');
    // And the UTC/Unix values should represent the same underlying instant
    const isoUtc = istFormats.find((f) => f.id === 'iso-utc').code;
    expect(isoUtc).toBe('2024-06-15T14:30:00Z');
  });

  it('gives Discord format rows a non-empty preview, and raw rows no preview', () => {
    for (const id of [
      'short-time',
      'long-time',
      'short-date',
      'long-date',
      'short-datetime',
      'long-datetime',
      'relative',
    ]) {
      expect(findFormat(id).preview).toBeTruthy();
    }
    for (const id of ['unix', 'iso-utc', 'iso-offset']) {
      expect(findFormat(id).preview).toBeNull();
    }
  });

  it('produces the same underlying instant regardless of which timezone was used to enter it', () => {
    // 14:30 UTC == 20:00 IST (+05:30) == 06:30 US Pacific (-08:00, winter)
    const fromUtc = getFormattedOutputs('2024-01-15', '14:30:00', 'UTC');
    const fromIst = getFormattedOutputs('2024-01-15', '20:00:00', 'Asia/Kolkata');
    const fromPst = getFormattedOutputs('2024-01-15', '06:30:00', 'Etc/GMT+8');

    const unixOf = (result) => result.find((f) => f.id === 'unix').code;
    expect(unixOf(fromIst)).toBe(unixOf(fromUtc));
    expect(unixOf(fromPst)).toBe(unixOf(fromUtc));
  });
});
