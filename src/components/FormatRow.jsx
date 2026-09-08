import { useState } from 'react';
import styles from './FormatRow.module.css';

export function FormatRow({ label, code, preview }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for browsers/contexts without Clipboard API access.
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.row}>
      <div className={styles.info}>
          <span className={styles.label}>{label}</span>
          {preview && <span className={styles.preview}>{preview}</span>}
        <code className={styles.code}>{code}</code>
      </div>

      <button type="button" className={styles.copyButton} onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}