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
