import styles from './Layout.module.css';

export function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.motif}
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="currentColor" fillOpacity="0.05" fontFamily="'Courier New', monospace">
          <text x="10" y="40" fontSize="20">
            &lt;t:1699999999:F&gt;
          </text>
          <text x="220" y="90" fontSize="16">
            &lt;t:1699999999:R&gt;
          </text>
          <text x="40" y="160" fontSize="18">
            &lt;t:1699999999:d&gt;
          </text>
          <text x="250" y="210" fontSize="20">
            &lt;t:1699999999:t&gt;
          </text>
          <text x="30" y="280" fontSize="16">
            &lt;t:1699999999:D&gt;
          </text>
          <text x="230" y="330" fontSize="18">
            &lt;t:1699999999:T&gt;
          </text>
          <text x="60" y="390" fontSize="16">
            &lt;t:1699999999:f&gt;
          </text>

          <circle cx="350" cy="60" r="18" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="2.5" />
          <path
            d="M350 48 L350 60 L360 66"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <circle cx="100" cy="230" r="14" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="2" />
          <path
            d="M100 221 L100 230 L107 235"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div className={styles.container}>{children}</div>
    </div>
  );
}
