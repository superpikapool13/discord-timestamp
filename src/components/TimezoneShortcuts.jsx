import { TIMEZONE_SHORTCUTS } from '../utils/timezoneShortcuts';
import styles from './TimezoneShortcuts.module.css';

export function TimezoneShortcuts({ timezone, onSelect }) {
  return (
    <div className={styles.wrapper}>
      {TIMEZONE_SHORTCUTS.map(({ label, zone }) => (
        <button
          key={zone}
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
