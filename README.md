# Discord Timestamp Generator

A clean, timezone-aware Discord timestamp generator. Pick a date, time & timezone —
get every `<t:unix:X>` format plus ISO & Unix, ready to copy.

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

- ⚡ **Instant previews** — see how each format renders in real Discord
- 🌍 **Full timezone support** — common zones + custom UTC offsets
- 🎨 **Dark/light theme** — respects system preference, manually toggleable
- 📱 **Responsive design** — works on desktop and mobile
- 🚀 **PWA-ready** — installable on mobile devices (coming soon)
- 0️⃣ **Zero dependencies** — built with vanilla React & Vite for speed

## Tech Stack

- **React 19** — Modern UI components
- **Vite** — Lightning-fast bundler
- **CSS modules** — Scoped, maintainable styling
- **Deployed to GitHub Pages** — Free, fast static hosting

## Running locally
Clone the repository
```bash
git clone https://github.com/superpikapool13/discord-timestamp.git dts
cd dts
```
Start the dev server:
```bash
npm install
npm run dev
```
Visit the local dev URL and open `main.html`.

### Build
```bash
npm run build
```
Outputs a production build to `dist/`.

## License

MIT — see [LICENSE](./LICENSE).