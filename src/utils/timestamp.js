import { zonedTimeToUtc, getOffsetMinutes } from './datetimeHelpers';

function formatIsoOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}

function toIsoUtc(date) {
  // Date#toISOString() always includes milliseconds; Discord/ISO consumers
  // generally expect second precision, so strip them.
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Renders a Unix instant (ms) as human-readable text, in the *browser's own
 * local timezone* - mirroring exactly what Discord itself does when it
 * renders a <t:...> timestamp for a viewer. This is deliberately NOT the
 * timezone the user picked as input; it's a preview of what any viewer
 * (including the user themself) will actually see.
 */
function previewShortTime(ms) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(ms);
}

function previewLongTime(ms) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(ms);
}

function previewShortDate(ms) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(ms);
}

function previewLongDate(ms) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(ms);
}

function previewShortDateTime(ms) {
  return `${previewLongDate(ms)} ${previewShortTime(ms)}`;
}

function previewLongDateTime(ms) {
  const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(ms);
  return `${weekday}, ${previewLongDate(ms)} ${previewShortTime(ms)}`;
}

// Standard "divisions" ladder for picking the most sensible relative-time
// unit, e.g. seconds -> minutes -> hours -> days -> weeks -> months -> years.
const RELATIVE_DIVISIONS = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

function previewRelative(ms) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  let duration = (ms - Date.now()) / 1000;

  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), 'year');
}

/**
 * Computes every supported output format for a given date/time/timezone
 * selection. Returns an ordered array of { id, label, code, preview }:
 *   - code: the primary string to copy (a Discord tag, or a raw value)
 *   - preview: secondary human-readable text shown for context (Discord
 *     format rows only - Unix/ISO rows have no separate preview, since the
 *     code already is the value)
 */
export function getFormattedOutputs(date, time, timezone) {
  const instant = zonedTimeToUtc(date, time, timezone);
  const ms = instant.getTime();
  const unixSeconds = Math.floor(ms / 1000);

  const discordFormats = [
    { id: 'short-time', label: 'Short Time', flag: 't', preview: previewShortTime(ms) },
    { id: 'long-time', label: 'Long Time', flag: 'T', preview: previewLongTime(ms) },
    { id: 'short-date', label: 'Short Date', flag: 'd', preview: previewShortDate(ms) },
    { id: 'long-date', label: 'Long Date', flag: 'D', preview: previewLongDate(ms) },
    {
      id: 'short-datetime',
      label: 'Short Date/Time',
      flag: 'f',
      preview: previewShortDateTime(ms),
    },
    { id: 'long-datetime', label: 'Long Date/Time', flag: 'F', preview: previewLongDateTime(ms) },
    { id: 'relative', label: 'Relative', flag: 'R', preview: previewRelative(ms) },
  ].map(({ id, label, flag, preview }) => ({
    id,
    label,
    code: `<t:${unixSeconds}:${flag}>`,
    preview,
  }));

  const isoOffsetMinutes = getOffsetMinutes(timezone, instant);

  return [
    ...discordFormats,
    {
      id: 'unix',
      label: 'Unix Timestamp',
      code: String(unixSeconds),
      preview: null,
    },
    {
      id: 'iso-utc',
      label: 'ISO 8601 (UTC)',
      code: toIsoUtc(instant),
      preview: null,
    },
    {
      id: 'iso-offset',
      label: 'ISO 8601 (Offset)',
      code: `${date}T${time}${formatIsoOffset(isoOffsetMinutes)}`,
      preview: null,
    },
  ];
}
