import { useMemo } from 'react';
import { FALLBACK_TIMEZONES } from '../utils/timezoneList';
import { FIXED_OFFSET_TIMEZONES } from '../utils/fixedOffsetTimezones';
import { getLocalTimeZone, getOffsetMinutes } from '../utils/datetimeHelpers';
import styles from './TimezoneSelector.module.css';

function getAllTimeZones() {
  if (typeof Intl.supportedValuesOf === 'function') {
    try {
      return Intl.supportedValuesOf('timeZone');
    } catch {
      return FALLBACK_TIMEZONES;
    }
  }
  return FALLBACK_TIMEZONES;
}

function formatOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const mins = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hours}:${mins}`;
}

export function TimezoneSelector({ timezone, onChange }) {
  const localZone = useMemo(() => getLocalTimeZone(), []);

  const sortedZones = useMemo(() => {
    const allZones = getAllTimeZones();
    const now = new Date();
    return allZones
      .map((zone) => ({ zone, offset: getOffsetMinutes(zone, now) }))
      .sort((a, b) => a.offset - b.offset || a.zone.localeCompare(b.zone));
  }, []);

  const fixedOffsetZones = useMemo(
    () =>
      FIXED_OFFSET_TIMEZONES.map(({ label, zone }) => ({
        label,
        zone,
        offset: getOffsetMinutes(zone),
      })).sort((a, b) => a.offset - b.offset),
    []
  );

  const localOffset = useMemo(() => getOffsetMinutes(localZone), [localZone]);

  return (
    <label className={styles.field}>
      <span className={styles.label}>Timezone</span>
      <select
        className={styles.select}
        value={timezone}
        onChange={(e) => onChange(e.target.value)}
      >
        <optgroup label="Detected">
          <option value={localZone}>
            {localZone} ({formatOffset(localOffset)})
          </option>
        </optgroup>

        <optgroup label="Fixed offset (no DST)">
          {fixedOffsetZones.map(({ label, zone, offset }) => (
            <option key={zone} value={zone}>
              {label} ({formatOffset(offset)})
            </option>
          ))}
        </optgroup>

        <optgroup label="All timezones (by UTC offset)">
          {sortedZones.map(({ zone, offset }) => (
            <option key={zone} value={zone}>
              {zone} ({formatOffset(offset)})
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}
