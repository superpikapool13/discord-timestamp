import styles from './Layout.module.css';

export function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}