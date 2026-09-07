import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        Built with React &amp; Vite ·{' '}
        <a
          href="https://github.com/superpikapool13/discord-timestamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
        </a>
        {' '}· MIT Licensed
      </span>
    </footer>
  );
}