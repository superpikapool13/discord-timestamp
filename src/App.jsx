import { useState } from 'react';
import { Layout } from './components/Layout';
import { ThemeToggle } from './components/ThemeToggle';
import { DateTimePicker } from './components/DateTimePicker';
import { TimezoneSelector } from './components/TimezoneSelector';
import { QuickButtons } from './components/QuickButtons';
import { getPartsInTimeZone, getLocalTimeZone } from './utils/datetimeHelpers';

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

  return (
    <Layout>
      <ThemeToggle />
      <div>
        <h1>Discord Timestamp Generator</h1>

        <DateTimePicker date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />

        <TimezoneSelector timezone={timezone} onChange={setTimezone} />

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
