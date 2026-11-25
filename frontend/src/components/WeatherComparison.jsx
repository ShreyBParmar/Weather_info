import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { GitCompare, Plus, X, Droplets, Wind, Gauge, Loader2 } from 'lucide-react';
import { formatTemperature, convertTemperature } from '../utils/temperature';

export const WeatherComparison = ({
  comparisonData,
  loading,
  onCompare,
  unit,
  onSelectCity,
}) => {
  const [newCity, setNewCity] = useState('');
  const [selectedCities, setSelectedCities] = useState(['London', 'Paris', 'Tokyo']);

  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    const trimmed = newCity.trim();
    if (!selectedCities.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...selectedCities, trimmed];
      setSelectedCities(updated);
      onCompare(updated);
    }
    setNewCity('');
  };

  const handleRemoveCity = (cityToRemove) => {
    if (selectedCities.length <= 1) return;
    const updated = selectedCities.filter((c) => c.toLowerCase() !== cityToRemove.toLowerCase());
    setSelectedCities(updated);
    onCompare(updated);
  };

  const chartData = (comparisonData?.cities || []).map((item) => ({
    city: item.city_name,
    temperature: convertTemperature(item.temperature, unit),
    humidity: item.humidity,
    wind_speed: item.wind_speed,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-800">City Weather Comparison</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare live weather metrics across multiple international cities
          </p>
        </div>

        {/* Add city form */}
        <form onSubmit={handleAddCity} className="flex items-center gap-2">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Add city to compare..."
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!newCity.trim() || loading}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>
      </div>

      {/* City Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedCities.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold rounded-xl"
          >
            {c}
            {selectedCities.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveCity(c)}
                className="hover:text-red-500 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </span>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-xs font-medium">Fetching comparison metrics...</span>
        </div>
      )}

      {/* Comparison Cards Grid */}
      {comparisonData?.cities && comparisonData.cities.length > 0 && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {comparisonData.cities.map((cityItem) => (
            <div
              key={cityItem.city_name}
              className="bg-slate-50/80 hover:bg-blue-50/40 rounded-2xl p-5 border border-slate-200/70 shadow-sm transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4
                    onClick={() => onSelectCity && onSelectCity(cityItem.city_name)}
                    className="font-bold text-slate-800 text-base cursor-pointer hover:text-blue-600 transition"
                  >
                    {cityItem.city_name}
                  </h4>
                  {cityItem.country && (
                    <span className="text-[11px] font-semibold text-slate-400">
                      {cityItem.country}
                    </span>
                  )}
                </div>

                <img
                  src={cityItem.icon_url}
                  alt={cityItem.description}
                  className="w-12 h-12 object-contain -my-2"
                />
              </div>

              <div>
                <p className="text-3xl font-extrabold text-slate-800">
                  {formatTemperature(cityItem.temperature, unit)}
                </p>
                <p className="text-xs font-medium text-slate-500 capitalize mt-0.5">
                  {cityItem.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>{cityItem.humidity}% Hum</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Wind className="w-3.5 h-3.5 text-teal-500" />
                  <span>{cityItem.wind_speed} m/s</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                  <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{cityItem.pressure} hPa</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Temperature Bar Chart */}
      {chartData.length > 0 && !loading && (
        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-700 mb-4">Temperature Comparison Chart</h4>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit={`°${unit}`} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value}°${unit}`, 'Temperature']}
                />
                <Bar dataKey="temperature" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
