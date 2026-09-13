import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { ThemeToggle } from './components/ThemeToggle';
import { DateTimePicker } from './components/DateTimePicker';
import { TimezoneSelector } from './components/TimezoneSelector';
import { TimezoneShortcuts } from './components/TimezoneShortcuts';
import { QuickButtons } from './components/QuickButtons';
import { OutputTable } from './components/OutputTable';
import { Footer } from './components/Footer';
import { getPartsInTimeZone, getLocalTimeZone, zonedTimeToUtc } from './utils/datetimeHelpers';
import { getFormattedOutputs } from './utils/timestamp';
import styles from './App.module.css';

const initialTimezone = getLocalTimeZone();
const initialParts = getPartsInTimeZone(new Date(), initialTimezone);

// How often to force a re-render so the "Relative" format (e.g. "in 3 hours")
// stays fresh even if the user leaves the tab open without touching any input.
const RELATIVE_REFRESH_MS = 30000;

function App() {
  const [timezone, setTimezone] = useState(initialTimezone);
  const [date, setDate] = useState(initialParts.date);
  const [time, setTime] = useState(initialParts.time);

  // Unused value, only its setter matters - ticking this forces a re-render
  // so getFormattedOutputs() recomputes the Relative format against the
  // current moment.
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), RELATIVE_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  function handleSetDateTime(newDate, newTime) {
    setDate(newDate);
    setTime(newTime);
  }

  function handleTimezoneChange(newZone) {
    // Preserve the actual instant in time - re-derive what that instant's
    // wall-clock date/time looks like in the newly selected timezone.
    const instant = zonedTimeToUtc(date, time, timezone);
    const newParts = getPartsInTimeZone(instant, newZone);
    setDate(newParts.date);
    setTime(newParts.time);
    setTimezone(newZone);
  }

  const formats = getFormattedOutputs(date, time, timezone);

  return (
    <Layout>
      <ThemeToggle />
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Discord Timestamp Generator</h1>
          <p className={styles.subtitle}>
            Pick a date, time & timezone — copy the format Discord understands.
          </p>
        </header>

        <div className={styles.columns}>
          <section className={styles.card} aria-label="Timestamp input">
            <h2 id="section-datetime" className={styles.sectionLabel}>
              Date &amp; Time
            </h2>
            <DateTimePicker date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />

            <h2 id="section-quickactions" className={styles.sectionLabel}>
              Quick Actions
            </h2>
            <QuickButtons
              timezone={timezone}
              date={date}
              time={time}
              onSetDateTime={handleSetDateTime}
            />

            <h2 id="section-timezone" className={styles.sectionLabel}>
              Timezone
            </h2>
            <TimezoneSelector timezone={timezone} onChange={handleTimezoneChange} />
            <TimezoneShortcuts timezone={timezone} onSelect={handleTimezoneChange} />
          </section>

          <section className={styles.outputSection} aria-labelledby="output-heading">
            <OutputTable formats={formats} />
          </section>
        </div>

        <Footer />
      </div>
    </Layout>
  );
}

export default App;