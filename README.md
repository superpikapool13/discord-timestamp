# Discord Timestamp Generator

A clean, timezone-aware Discord timestamp generator. Pick a date, time & timezone, & get every Discord timestamp format (`<t:unix:X>`) plus ISO & Unix, ready to copy.

![Discord Timestamp Generator](./assets/og-image.svg)

> 100% client-side — no data ever leaves your browser.

**Live:** https://superpikapool13.github.io/discord-timestamp/

## Overview

Discord timestamps are a powerful feature, but creating them can be tedious. This tool lets you:

- **Pick any date & time** with an intuitive date/time picker
- **Select your timezone** (or any offset)
- **Get all formats instantly:**
  - `<t:unix:t>` Short time (5:00 PM)
  - `<t:unix:T>` Long time (5:00:00 PM)
  - `<t:unix:d>` Short date (01/08/2025)
  - `<t:unix:D>` Long date (August 1, 2025)
  - `<t:unix:f>` Short date+time (August 1, 2025 5:00 PM)
  - `<t:unix:F>` Long date+time (Thursday, August 1, 2025 5:00 PM)
  - `<t:unix:R>` Relative (in 3 hours)
  - Unix timestamp (raw: 1753999200)
  - ISO 8601 UTC (2025-08-01T17:00:00Z)
  - ISO 8601 with offset (2025-08-01T17:00:00+05:30)
- **Copy any format** with one click
- **Toggle dark/light theme** based on your preference

## Features

- **Instant previews** — see how each Discord format renders, using your own browser's local time (exactly how Discord itself renders it for any viewer)
- **Rich timezone input** — search by zone name (e.g. "Kolkata"), type a raw UTC offset (e.g. "+5:30"), or use fixed-offset codes (PST, EST, CET, AEST, etc.) that never shift for daylight saving
- **One-click timezone shortcuts** — PT, ET, UTC, CET, IST, SGT, JST, AEST
- **Quick actions** — jump to Now, Midnight, Noon, or the start of the current hour
- **Dark/light theme** — respects system preference, manually toggleable, persisted across visits
- **Copy any format** with one click, with confirmation feedback
- **Live-updating relative time** — refreshes periodically so "in 3 hours" doesn't go stale
- **100% client-side** — no data ever leaves your browser, no server involved
- **Responsive design** — works on desktop and mobile
- **Installable PWA** — add to home screen on mobile or desktop, works offline via a network-first service worker
- **Zero dependencies** — built with vanilla React & Vite for speed

## Project Structure

```
├── assets/                   # Source SVGs (favicon, OG image, background motif)
├── public/                   # Static files copied as-is (robots.txt, manifest, sw, converted icons)
├── src/
│   ├── components/           # React components (one file + one .module.css each)
│   ├── tests/                # Vitest unit tests for src/utils/
│   ├── utils/                # Timezone/timestamp logic, no React dependencies
│   ├── App.jsx
│   ├── script.jsx            # Entry point (imported by main.html, registers the service worker)
│   └── styles.css            # Global reset + design tokens
├── main.html                 # Dev entry point (built into index.html)
├── vite.config.js
├── vitest.setup.js           # Pins test-process timezone to UTC for deterministic tests
└── package.json
```

## Tech Stack

- **React 19** — Modern UI components
- **Vite** — Lightning-fast bundler
- **CSS modules** — Scoped, maintainable styling
- **Deployed to GitHub Pages** — Free, fast static hosting

## Development

Clone and install:

```bash
git clone https://github.com/superpikapool13/discord-timestamp.git dts
cd dts
npm install
```

Start the dev server:

```bash
npm run dev
```

Visit the local dev URL and open `main.html`.

## Build

```bash
npm run build
```

Outputs a production build to `dist/`.

## Testing

Unit tests cover the pure utility functions in `src/utils/`: timezone conversion, DST handling, free-text input resolution, and the format-generation logic. These are the areas most likely to have a subtle bug, so they're the ones worth testing.

```bash
npm test           # run once
npm run test:watch # re-run on file changes
```

## Code Quality

ESLint and Prettier are configured to not conflict, with `eslint-config-prettier` disabling any ESLint stylistic rules that would otherwise fight with Prettier's formatting decisions.

```bash
npm run lint         # check for lint errors
npm run format       # auto-format all files with Prettier
npm run format:check # check formatting without changing files
```

## License

MIT — see [LICENSE](./LICENSE).