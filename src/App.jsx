import { useState } from 'react';
import { Layout } from './components/Layout';
import { ThemeToggle } from './components/ThemeToggle';
import { DateTimePicker } from './components/DateTimePicker';
import { TimezoneSelector } from './components/TimezoneSelector';
import { TimezoneShortcuts } from './components/TimezoneShortcuts';
import { QuickButtons } from './components/QuickButtons';
import { getPartsInTimeZone, getLocalTimeZone, zonedTimeToUtc } from './utils/datetimeHelpers';

const initialTimezone = getLocalTimeZone();
const initialParts = getPartsInTimeZone(new Date(), initialTimezone);

function App() {
  const [timezone, setTimezone] = useState(initialTimezone);
  const [date, setDate] = useState(initialParts.date);
  const [time, setTime] = useState(initialParts.time);

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

  return (
    <Layout>
      <ThemeToggle />
      <div>
        <h1>Discord Timestamp Generator</h1>

        <DateTimePicker date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />

        <TimezoneSelector timezone={timezone} onChange={handleTimezoneChange} />
        <TimezoneShortcuts timezone={timezone} onSelect={handleTimezoneChange} />

        <QuickButtons
          timezone={timezone}
          date={date}
          time={time}
          onSetDateTime={handleSetDateTime}
        />

        <p>Coming soon...</p>
      </div>
    </Layout>
  );
}

export default App;