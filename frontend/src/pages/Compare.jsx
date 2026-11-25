import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherComparison } from '../components/WeatherComparison';
import { ErrorMessage } from '../components/ErrorMessage';
import { weatherService } from '../services/weatherService';

export const Compare = () => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem('weather_temp_unit') || 'C');
  const navigate = useNavigate();

  const handleCompare = useCallback(async (citiesList) => {
    if (!citiesList || citiesList.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.compareWeather(citiesList);
      setComparisonData(data);
    } catch (err) {
      setError(err.message || 'Failed to compare cities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleCompare(['London', 'Paris', 'Tokyo']);
  }, [handleCompare]);

  const handleSelectCity = (cityName) => {
    navigate(`/?city=${encodeURIComponent(cityName)}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800">
          Compare Weather
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Side-by-side analysis of temperatures, conditions, and atmospheric data
        </p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => handleCompare(['London', 'Paris', 'Tokyo'])}
        />
      )}

      <WeatherComparison
        comparisonData={comparisonData}
        loading={loading}
        onCompare={handleCompare}
        unit={unit}
        onSelectCity={handleSelectCity}
      />
    </div>
  );
};
