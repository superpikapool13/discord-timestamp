export const FALLBACK_TIMEZONES = [
  'UTC',
  'Pacific/Midway',
  'Pacific/Honolulu',
  'America/Anchorage',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Atlantic/Azores',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Athens',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Jerusalem',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Perth',
  'Australia/Sydney',
  'Pacific/Auckland',
];

/**
 * Returns every IANA timezone the browser/runtime knows about, via the
 * modern Intl.supportedValuesOf API where available. Always merged with a
 * curated fallback list of common zones, since some runtimes have been
 * observed to omit or alias certain zones (e.g. differing ICU/tzdata
 * versions across Node/browser builds) - this guarantees common zones
 * stay resolvable even if the runtime's own list is incomplete.
 */
export function getAllTimeZones() {
  let zones = FALLBACK_TIMEZONES;

  if (typeof Intl.supportedValuesOf === 'function') {
    try {
      const supported = Intl.supportedValuesOf('timeZone');
      if (Array.isArray(supported) && supported.length > 0) {
        zones = supported;
      }
    } catch {
      // keep FALLBACK_TIMEZONES
    }
  }

  return Array.from(new Set([...zones, ...FALLBACK_TIMEZONES]));
}