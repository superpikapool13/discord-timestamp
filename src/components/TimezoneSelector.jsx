import { useEffect, useMemo, useState } from 'react';
import { getAllTimeZones } from '../utils/timezoneList';
import { FIXED_OFFSET_TIMEZONES } from '../utils/fixedOffsetTimezones';
import { getLocalTimeZone, getOffsetMinutes } from '../utils/datetimeHelpers';
import { resolveTimezoneInput, getDisplayLabel, formatTimezoneOption } from '../utils/timezoneInput';
import styles from './TimezoneSelector.module.css';

function formatOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const mins = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hours}:${mins}`;
}

export function TimezoneSelector({ timezone, onChange }) {
  const [draft, setDraft] = useState(() => getDisplayLabel(timezone));
  const [isInvalid, setIsInvalid] = useState(false);

  const localZone = useMemo(() => getLocalTimeZone(), []);

  // Keep the field's text in sync when the timezone changes from elsewhere
  // (e.g. a shortcut button click).
  useEffect(() => {
    setDraft(getDisplayLabel(timezone));
    setIsInvalid(false);
  }, [timezone]);

  const datalistOptions = useMemo(() => {
    const now = new Date();
    const sortedZones = getAllTimeZones()
      .filter((zone) => zone !== localZone)
      .sort((a, b) => getOffsetMinutes(a, now) - getOffsetMinutes(b, now) || a.localeCompare(b));

    const fixedOptions = FIXED_OFFSET_TIMEZONES.map((f) => formatTimezoneOption(f.zone, now));
    const zoneOptions = sortedZones.map((zone) => formatTimezoneOption(zone, now));

    return [formatTimezoneOption(localZone, now), ...fixedOptions, ...zoneOptions];
  }, [localZone]);

  const currentOffset = useMemo(() => getOffsetMinutes(timezone), [timezone]);

  function handleChange(e) {
    const value = e.target.value;
    setDraft(value);

    if (value.trim() === '') {
      setIsInvalid(false);
      return;
    }

    const resolved = resolveTimezoneInput(value);
    if (resolved) {
      setIsInvalid(false);
      onChange(resolved);
    } else {
      setIsInvalid(true);
    }
  }

  function handleFocus() {
    // Clear the field so the full list of suggestions shows immediately,
    // instead of being filtered down to near-nothing by whatever zone
    // name is already sitting in the field.
    setDraft('');
    setIsInvalid(false);
  }

  function handleBlur() {
    // If what's left in the field never resolved to a valid zone, revert
    // to the last valid committed timezone rather than leaving it broken.
    const resolved = resolveTimezoneInput(draft);
    if (!resolved) {
      setDraft(getDisplayLabel(timezone));
      setIsInvalid(false);
    }
  }

  return (
    <label className={styles.field}>
      <span className={styles.label}>Search timezone</span>
      <input
        type="text"
        name="timezone"
        className={`${styles.input} ${isInvalid ? styles.invalid : ''}`}
        list="timezone-options"
        value={draft}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="e.g. Asia/Kolkata or +05:30"
        autoComplete="off"
      />
      <datalist id="timezone-options">
        {datalistOptions.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
      <span className={styles.hint}>Current offset: {formatOffset(currentOffset)}</span>
    </label>
  );
}