import styles from './DateTimePicker.module.css';

export function DateTimePicker({ date, time, onDateChange, onTimeChange }) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.field}>
        <span className={styles.label}>Date</span>
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Time</span>
        <input
          type="time"
          step="1"
          className={styles.input}
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </label>
    </div>
  );
}
