import { useMemo } from 'react';
import { TIMEZONE_SHORTCUTS } from '../utils/timezoneShortcuts';
import { getLocalTimeZone } from '../utils/datetimeHelpers';
import styles from './TimezoneShortcuts.module.css';

export function TimezoneShortcuts({ timezone, onSelect }) {
  const localZone = useMemo(() => getLocalTimeZone(), []);

  const shortcuts = useMemo(
    () => [{ label: 'Local', zone: localZone }, ...TIMEZONE_SHORTCUTS],
    [localZone]
  );

  return (
    <div className={styles.wrapper} role="group" aria-label="Timezone shortcuts">
      {shortcuts.map(({ label, zone }) => (
        <button
          key={label}
          type="button"
          className={`${styles.button} ${zone === timezone ? styles.active : ''}`}
          onClick={() => onSelect(zone)}
          aria-pressed={zone === timezone}
        >
          {label}
        </button>
      ))}
    </div>
  );
}