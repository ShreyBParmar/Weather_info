import { useState, useEffect, useCallback } from 'react';
import { weatherService } from '../services/weatherService';

export const useWeather = (initialCity = 'London') => {
  const [city, setCity] = useState(initialCity);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weather_temp_unit') || 'C';
  });
  const [favorites, setFavorites] = useState([]);

  // Fetch user favorites
  const loadFavorites = useCallback(async () => {
    try {
      const data = await weatherService.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Toggle temperature unit without refetching
  const toggleUnit = useCallback(() => {
    setUnit((prevUnit) => {
      const nextUnit = prevUnit === 'C' ? 'F' : 'C';
      localStorage.setItem('weather_temp_unit', nextUnit);
      return nextUnit;
    });
  }, []);

  // Fetch weather data for a city
  const fetchWeather = useCallback(async (searchCity) => {
    if (!searchCity || !searchCity.trim()) {
      setError('Please enter a valid city name.');
      return;
    }

    const targetCity = searchCity.trim();
    setLoading(true);
    setError(null);

    try {
      // Parallel fetch of current weather and forecast
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(targetCity),
        weatherService.getForecast(targetCity),
      ]);

      setCurrentWeather(currentData);
      setForecast(forecastData);
      setCity(currentData.city_name);

      // Record in search history in background
      weatherService.addHistory({
        city_name: currentData.city_name,
        country: currentData.country,
      }).catch((e) => console.error('Failed to record search history:', e));

    } catch (err) {
      setError(err.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if current city is in favorites
  const isFavorite = Boolean(
    currentWeather &&
    favorites.some(
      (f) =>
        f.city_name.toLowerCase() === currentWeather.city_name.toLowerCase() &&
        (!currentWeather.country || f.country === currentWeather.country)
    )
  );

  // Toggle favorite for current city
  const toggleFavorite = async () => {
    if (!currentWeather) return;

    try {
      const existing = favorites.find(
        (f) =>
          f.city_name.toLowerCase() === currentWeather.city_name.toLowerCase() &&
          (!currentWeather.country || f.country === currentWeather.country)
      );

      if (existing) {
        await weatherService.removeFavorite(existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      } else {
        const newFav = await weatherService.addFavorite({
          city_name: currentWeather.city_name,
          country: currentWeather.country,
          latitude: currentWeather.latitude,
          longitude: currentWeather.longitude,
        });
        setFavorites((prev) => [newFav, ...prev]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Initial load
  useEffect(() => {
    if (initialCity) {
      fetchWeather(initialCity);
    }
  }, [initialCity, fetchWeather]);

  return {
    city,
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    toggleUnit,
    fetchWeather,
    favorites,
    isFavorite,
    toggleFavorite,
    reloadFavorites: loadFavorites,
  };
};
