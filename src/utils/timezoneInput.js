import { getAllTimeZones } from './timezoneList';
import { FIXED_OFFSET_TIMEZONES } from './fixedOffsetTimezones';

function formatOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const mins = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hours}:${mins}`;
}

/**
 * Resolves free-text timezone input into a value the rest of the app
 * understands (a real IANA zone id, or a synthetic "UTC+05:30" style
 * fixed-offset string). Accepts:
 *   - An exact (case-insensitive) IANA zone name, e.g. "Asia/Kolkata"
 *   - One of the friendly fixed-offset labels, e.g. "PST (Pacific..., fixed)"
 *   - A raw UTC offset, e.g. "+5:30", "-8", "utc+2", "gmt-04:00", "5:30"
 * Returns null if the input doesn't match anything recognizable.
 */
export function resolveTimezoneInput(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  const fixedMatch = FIXED_OFFSET_TIMEZONES.find(
    (f) => f.label.toLowerCase() === trimmed.toLowerCase()
  );
  if (fixedMatch) return fixedMatch.zone;

  const zoneMatch = getAllTimeZones().find((z) => z.toLowerCase() === trimmed.toLowerCase());
  if (zoneMatch) return zoneMatch;

  // Raw offset: optional UTC/GMT prefix, optional sign, 1-2 digit hours,
  // optional minutes (with or without a colon).
  const offsetMatch = trimmed.match(/^(?:UTC|GMT)?\s*([+-])?\s*(\d{1,2})(?::?(\d{2}))?$/i);
  if (offsetMatch) {
    const sign = offsetMatch[1] === '-' ? -1 : 1;
    const hours = parseInt(offsetMatch[2], 10);
    const minutes = offsetMatch[3] ? parseInt(offsetMatch[3], 10) : 0;
    if (hours < 24 && minutes < 60) {
      return formatOffset(sign * (hours * 60 + minutes));
    }
  }

  return null;
}

/**
 * Returns a human-friendly display string for a resolved timezone value,
 * for populating the input when it's not actively being edited.
 */
export function getDisplayLabel(zone) {
  if (/^UTC[+-]\d{2}:\d{2}$/.test(zone)) return zone;
  const fixed = FIXED_OFFSET_TIMEZONES.find((f) => f.zone === zone);
  if (fixed) return fixed.label;
  return zone;
}
