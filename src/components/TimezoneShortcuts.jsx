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
    <div className={styles.wrapper}>
      {shortcuts.map(({ label, zone }) => (
        <button
          key={label}
          type="button"
          className={`${styles.button} ${zone === timezone ? styles.active : ''}`}
          onClick={() => onSelect(zone)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}