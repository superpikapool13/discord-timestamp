/**
 * Extracts Y-M-D and H:m:s parts for a given Date, as observed in a
 * specific IANA timezone. Used to populate date/time inputs so they
 * reflect "wall clock" time in the selected timezone, not the browser's
 * local timezone.
 */
export function getPartsInTimeZone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const map = {};
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = part.value;
  }

  // Some locales report midnight as "24" instead of "00" with hour12: false.
  const hour = map.hour === '24' ? '00' : map.hour;

  return {
    date: `${map.year}-${map.month}-${map.day}`,
    time: `${hour}:${map.minute}:${map.second}`,
  };
}

/**
 * Returns the browser's detected IANA timezone, e.g. "Asia/Kolkata".
 * Falls back to "UTC" if detection fails.
 */
export function getLocalTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Returns the UTC offset of a timezone, in minutes, at a given instant.
 * Positive values are ahead of UTC (e.g. +330 for IST), negative are behind.
 */
export function getOffsetMinutes(timeZone, date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  });

  const part = formatter.formatToParts(date).find((p) => p.type === 'timeZoneName');
  const value = part ? part.value : 'GMT+00:00';

  // Matches "GMT+05:30", "GMT-08:00", or bare "GMT" (treated as +00:00)
  const match = value.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
  if (!match) return 0;

  const sign = match[1] === '-' ? -1 : 1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return sign * (hours * 60 + minutes);
}

/**
 * Converts a "wall clock" date + time as observed in a given IANA timezone
 * into the actual UTC instant (a Date object) it represents.
 *
 * JS's Date has no native concept of "this date/time in timezone X" - it can
 * only represent absolute instants. This works around that by:
 *   1. Guessing the instant assuming the wall-clock values are UTC
 *   2. Checking what offset the target timezone has at that guessed instant
 *   3. Adjusting by that offset
 *   4. Re-checking once more, since offset can shift across a DST boundary
 */
export function zonedTimeToUtc(dateStr, timeStr, timeZone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute, second = 0] = timeStr.split(':').map(Number);

  const guessUtc = Date.UTC(year, month - 1, day, hour, minute, second);

  const offset1 = getOffsetMinutes(timeZone, new Date(guessUtc));
  let utc = guessUtc - offset1 * 60000;

  // Re-check in case the first guess landed on the wrong side of a DST shift.
  const offset2 = getOffsetMinutes(timeZone, new Date(utc));
  if (offset2 !== offset1) {
    utc = guessUtc - offset2 * 60000;
  }

  return new Date(utc);
}