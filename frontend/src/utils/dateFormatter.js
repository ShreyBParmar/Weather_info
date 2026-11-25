/**
 * Date and time formatting helpers
 */

export const formatUnixTime = (timestamp, timezoneOffset = 0) => {
  if (!timestamp) return '--:--';
  // Adjust for city timezone offset in seconds
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toUTCString().slice(17, 22); // e.g. "06:45"
};

export const formatReadableDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatHourOnly = (timeStrOrTimestamp) => {
  if (!timeStrOrTimestamp) return '';
  if (typeof timeStrOrTimestamp === 'number') {
    const d = new Date(timeStrOrTimestamp * 1000);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  }
  // If string "2026-11-25 12:00:00"
  const d = new Date(timeStrOrTimestamp);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
};
