import { getAllTimeZones } from './timezoneList';
import { FIXED_OFFSET_TIMEZONES } from './fixedOffsetTimezones';
import { getOffsetMinutes } from './datetimeHelpers';

function formatOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const mins = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hours}:${mins}`;
}

/**
 * Returns the short, localized abbreviation for a real IANA zone at a given
 * instant (e.g. "IST", "PDT", "GMT+5:45" for zones with no common name).
 * Falls back to the formatted offset if Intl can't produce one.
 */
function getShortCode(zone, date) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      timeZoneName: 'short',
    });
    const part = formatter.formatToParts(date).find((p) => p.type === 'timeZoneName');
    return part ? part.value : formatOffset(getOffsetMinutes(zone, date));
  } catch {
    return formatOffset(getOffsetMinutes(zone, date));
  }
}

/**
 * Builds the display string for a timezone option, in the form:
 *   "UTC+05:30 - IST (Asia/Kolkata)"
 * Fixed-offset entries (PST, CET, etc.) use their known code/description
 * instead of Intl's short name. UTC itself is shown without a redundant
 * parenthetical.
 */
export function formatTimezoneOption(zone, referenceDate = new Date()) {
  const fixed = FIXED_OFFSET_TIMEZONES.find((f) => f.zone === zone);
  if (fixed) {
    const offset = getOffsetMinutes(zone);
    return `${formatOffset(offset)} - ${fixed.code} (${fixed.description})`;
  }

  if (zone === 'UTC') {
    return 'UTC+00:00 - UTC';
  }

  const offset = getOffsetMinutes(zone, referenceDate);
  const code = getShortCode(zone, referenceDate);
  return `${formatOffset(offset)} - ${code} (${zone})`;
}

/**
 * Returns a human-friendly display string for a resolved timezone value,
 * for populating the input when it's not actively being edited.
 */
export function getDisplayLabel(zone) {
  if (/^UTC[+-]\d{2}:\d{2}$/.test(zone)) return zone;
  return formatTimezoneOption(zone);
}

// Matches our composite display format: "UTC+05:30 - IST (Asia/Kolkata)"
// or the bare UTC case: "UTC+00:00 - UTC"
const COMPOSITE_RE = /^UTC([+-]\d{2}:\d{2})\s*-\s*(.+?)\s*(?:\(([^)]+)\))?$/i;

/**
 * Resolves free-text timezone input into a value the rest of the app
 * understands (a real IANA zone id, or a synthetic "UTC+05:30" style
 * fixed-offset string). Accepts:
 *   - An exact (case-insensitive) IANA zone name, e.g. "Asia/Kolkata"
 *   - A fixed-offset code, e.g. "PST"
 *   - A composite display string picked from the dropdown, e.g.
 *     "UTC+05:30 - IST (Asia/Kolkata)"
 *   - A raw UTC offset, e.g. "+5:30", "-8", "utc+2", "gmt-04:00", "5:30"
 * Returns null if the input doesn't match anything recognizable.
 */
export function resolveTimezoneInput(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // Exact fixed-offset code, e.g. "PST"
  const codeMatch = FIXED_OFFSET_TIMEZONES.find(
    (f) => f.code.toLowerCase() === trimmed.toLowerCase()
  );
  if (codeMatch) return codeMatch.zone;

  // Exact real IANA zone id, e.g. "Asia/Kolkata"
  const zoneMatch = getAllTimeZones().find((z) => z.toLowerCase() === trimmed.toLowerCase());
  if (zoneMatch) return zoneMatch;

  // Composite display string picked from the dropdown
  const composite = trimmed.match(COMPOSITE_RE);
  if (composite) {
    const [, offsetPart, codePart, detailPart] = composite;

    if (detailPart) {
      const detailZoneMatch = getAllTimeZones().find(
        (z) => z.toLowerCase() === detailPart.toLowerCase()
      );
      if (detailZoneMatch) return detailZoneMatch;

      const detailFixedMatch = FIXED_OFFSET_TIMEZONES.find(
        (f) => f.description.toLowerCase() === detailPart.toLowerCase()
      );
      if (detailFixedMatch) return detailFixedMatch.zone;
    }

    const codeFixedMatch = FIXED_OFFSET_TIMEZONES.find(
      (f) => f.code.toLowerCase() === codePart.toLowerCase()
    );
    if (codeFixedMatch) return codeFixedMatch.zone;

    if (codePart.toLowerCase() === 'utc') return 'UTC';

    // Fall back to the offset itself if nothing else matched.
    return `UTC${offsetPart}`;
  }

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