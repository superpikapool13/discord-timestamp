import { getPartsInTimeZone } from '../utils/datetimeHelpers';
import styles from './QuickButtons.module.css';

export function QuickButtons({ timezone, date, time, onSetDateTime }) {
  function handleNow() {
    const parts = getPartsInTimeZone(new Date(), timezone);
    onSetDateTime(parts.date, parts.time);
  }

  function handleMidnight() {
    onSetDateTime(date, '00:00:00');
  }

  function handleNoon() {
    onSetDateTime(date, '12:00:00');
  }

  function handleStartOfHour() {
    const [hour] = time.split(':');
    onSetDateTime(date, `${hour}:00:00`);
  }

  function handleHalfHour() {
    const [hour] = time.split(':');
    onSetDateTime(date, `${hour}:30:00`);
  }

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.button} onClick={handleNow}>
        Now
      </button>
      <button type="button" className={styles.button} onClick={handleMidnight}>
        Midnight
      </button>
      <button type="button" className={styles.button} onClick={handleNoon}>
        Noon
      </button>
      <button type="button" className={styles.button} onClick={handleStartOfHour}>
        Start of hour
      </button>
      <button type="button" className={styles.button} onClick={handleHalfHour}>
        Half hour
      </button>
    </div>
  );
}