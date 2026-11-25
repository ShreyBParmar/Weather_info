import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { convertTemperature } from '../utils/temperature';

export const WeatherChart = ({ hourly, daily, unit }) => {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' | 'daily'

  if ((!hourly || hourly.length === 0) && (!daily || daily.length === 0)) {
    return null;
  }

  // Prepare hourly data
  const hourlyData = (hourly || []).map((item) => ({
    time: item.time_label,
    temp: convertTemperature(item.temperature, unit),
    feels_like: convertTemperature(item.feels_like, unit),
    pop: Math.round(item.pop * 100),
  }));

  // Prepare daily data
  const dailyData = (daily || []).map((item) => ({
    day: item.day_name.slice(0, 3),
    date: item.date,
    temp_min: convertTemperature(item.temp_min, unit),
    temp_max: convertTemperature(item.temp_max, unit),
    temp_day: convertTemperature(item.temp_day, unit),
  }));

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Weather Visualizations</h3>
        </div>

        {/* Chart Selector Tab */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              activeTab === 'hourly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Hourly Temperature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              activeTab === 'daily'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daily High / Low Trend
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'hourly' ? (
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit={`°${unit}`} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value}°${unit}`, 'Temperature']}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          ) : (
            <LineChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit={`°${unit}`} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
                formatter={(value, name) => [
                  `${value}°${unit}`,
                  name === 'temp_max' ? 'High Temp' : 'Low Temp',
                ]}
              />
              <Line
                type="monotone"
                dataKey="temp_max"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#ef4444' }}
                name="temp_max"
              />
              <Line
                type="monotone"
                dataKey="temp_min"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3b82f6' }}
                name="temp_min"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
