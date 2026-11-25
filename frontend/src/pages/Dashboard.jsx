import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { CurrentWeather } from '../components/CurrentWeather';
import { WeatherDetails } from '../components/WeatherDetails';
import { HourlyForecast } from '../components/HourlyForecast';
import { DailyForecast } from '../components/DailyForecast';
import { WeatherChart } from '../components/WeatherChart';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { useWeather } from '../hooks/useWeather';

export const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || 'London';

  const {
    city,
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    toggleUnit,
    fetchWeather,
    isFavorite,
    toggleFavorite,
  } = useWeather(cityParam);

  const handleSearch = (newCity) => {
    setSearchParams({ city: newCity });
    fetchWeather(newCity);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Search bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Weather Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time atmospheric data and multi-day forecasts
          </p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {/* Error state */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => fetchWeather(cityParam || city)}
        />
      )}

      {/* Loading state */}
      {loading && !currentWeather && <Loading />}

      {/* Main Content */}
      {currentWeather && (
        <div className="space-y-6">
          {/* Main Weather Hero Card */}
          <CurrentWeather
            weather={currentWeather}
            unit={unit}
            onToggleUnit={toggleUnit}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />

          {/* 6 Key Meteorological Statistics Cards */}
          <WeatherDetails weather={currentWeather} />

          {/* Hourly Forecast scroll cards */}
          {forecast?.hourly && (
            <HourlyForecast hourly={forecast.hourly} unit={unit} />
          )}

          {/* Charts & 5-Day Forecast Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {forecast && (
              <WeatherChart
                hourly={forecast.hourly}
                daily={forecast.daily}
                unit={unit}
              />
            )}

            {forecast?.daily && (
              <DailyForecast daily={forecast.daily} unit={unit} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
