import { BackgroundMotif } from './BackgroundMotif';
import styles from './Layout.module.css';

export function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <BackgroundMotif />
      <div className={styles.container}>{children}</div>
    </div>
  );
}