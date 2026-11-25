/**
 * Mathematically accurate temperature conversions and formatting
 */

export const celsiusToFahrenheit = (celsius) => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return null;
  return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
};

export const fahrenheitToCelsius = (fahrenheit) => {
  if (fahrenheit === null || fahrenheit === undefined || isNaN(fahrenheit)) return null;
  return Math.round((((fahrenheit - 32) * 5) / 9) * 10) / 10;
};

export const convertTemperature = (tempInCelsius, unit = 'C') => {
  if (tempInCelsius === null || tempInCelsius === undefined) return '--';
  if (unit === 'F') {
    return celsiusToFahrenheit(tempInCelsius);
  }
  return Math.round(tempInCelsius * 10) / 10;
};

export const formatTemperature = (tempInCelsius, unit = 'C') => {
  const converted = convertTemperature(tempInCelsius, unit);
  if (converted === '--') return '--°';
  return `${Math.round(converted)}°${unit}`;
};
