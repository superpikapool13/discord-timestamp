import { useMemo } from 'react';
import { FALLBACK_TIMEZONES } from '../utils/timezoneList';
import { getLocalTimeZone } from '../utils/datetimeHelpers';
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

function formatOffset(timeZone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    });
    const part = formatter.formatToParts(new Date()).find((p) => p.type === 'timeZoneName');
    return part ? part.value : '';
  } catch {
    return '';
  }
}

export function TimezoneSelector({ timezone, onChange }) {
  const localZone = useMemo(() => getLocalTimeZone(), []);
  const allZones = useMemo(() => getAllTimeZones(), []);

  const otherZones = useMemo(
    () => allZones.filter((tz) => tz !== localZone && tz !== 'UTC').sort(),
    [allZones, localZone]
  );

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
            {localZone} ({formatOffset(localZone)})
          </option>
        </optgroup>
        <optgroup label="Common">
          <option value="UTC">UTC (+00:00)</option>
        </optgroup>
        <optgroup label="All timezones">
          {otherZones.map((tz) => (
            <option key={tz} value={tz}>
              {tz} ({formatOffset(tz)})
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}
