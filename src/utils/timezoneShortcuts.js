// Common timezone shortcuts, ordered west to east by UTC offset.
// Note: PT, ET, CET, and AEST observe daylight saving in their real-world
// zones, so their displayed offset shifts by an hour for part of the year.
export const TIMEZONE_SHORTCUTS = [
  { label: 'PT', zone: 'America/Los_Angeles' },
  { label: 'ET', zone: 'America/New_York' },
  { label: 'UTC', zone: 'UTC' },
  { label: 'CET', zone: 'Europe/Paris' },
  { label: 'IST', zone: 'Asia/Kolkata' },
  { label: 'SGT', zone: 'Asia/Singapore' },
  { label: 'JST', zone: 'Asia/Tokyo' },
  { label: 'AEST', zone: 'Australia/Sydney' },
];
