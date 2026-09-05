// Named fixed-offset timezones for common abbreviations whose real-world
// zone observes daylight saving. Unlike "America/Los_Angeles" (which shifts
// between PST/PDT across the year), these use IANA's Etc/GMT zones, which
// never change offset - useful when someone wants "always PST" regardless
// of the current season.
//
// Note: Etc/GMT sign convention is inverted (POSIX-style): Etc/GMT+8 means
// UTC-8, not UTC+8.
export const FIXED_OFFSET_TIMEZONES = [
  { label: 'PST (Pacific Standard Time, fixed)', zone: 'Etc/GMT+8' },
  { label: 'PDT (Pacific Daylight Time, fixed)', zone: 'Etc/GMT+7' },
  { label: 'EST (Eastern Standard Time, fixed)', zone: 'Etc/GMT+5' },
  { label: 'EDT (Eastern Daylight Time, fixed)', zone: 'Etc/GMT+4' },
  { label: 'CET (Central European Time, fixed)', zone: 'Etc/GMT-1' },
  { label: 'CEST (Central European Summer Time, fixed)', zone: 'Etc/GMT-2' },
  { label: 'AEST (Australian Eastern Standard Time, fixed)', zone: 'Etc/GMT-10' },
  { label: 'AEDT (Australian Eastern Daylight Time, fixed)', zone: 'Etc/GMT-11' },
];
