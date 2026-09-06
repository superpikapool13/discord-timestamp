import { FormatRow } from './FormatRow';
import styles from './OutputTable.module.css';

export function OutputTable({ formats }) {
  return (
    <div className={styles.table}>
      {formats.map(({ id, label, code, preview }) => (
        <FormatRow key={id} label={label} code={code} preview={preview} />
      ))}
    </div>
  );
}