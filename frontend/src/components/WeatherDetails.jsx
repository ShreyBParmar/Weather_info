import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { formatUnixTime } from '../utils/dateFormatter';

export const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  const items = [
    {
      title: 'Humidity',
      value: `${weather.humidity}%`,
      subtitle: weather.humidity > 60 ? 'High humidity' : 'Comfortable',
      icon: Droplets,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Wind Speed',
      value: `${weather.wind_speed} m/s`,
      subtitle: weather.wind_deg !== null ? `Direction: ${weather.wind_deg}°` : 'Calm breeze',
      icon: Wind,
      iconColor: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Pressure',
      value: `${weather.pressure} hPa`,
      subtitle: weather.pressure > 1013 ? 'High pressure' : 'Low pressure',
      icon: Gauge,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Visibility',
      value: weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : '10 km',
      subtitle: weather.visibility >= 10000 ? 'Clear visibility' : 'Hazy / mist',
      icon: Eye,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Sunrise',
      value: formatUnixTime(weather.sunrise, weather.timezone_offset),
      subtitle: 'Morning dawn',
      icon: Sunrise,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Sunset',
      value: formatUnixTime(weather.sunset, weather.timezone_offset),
      subtitle: 'Evening dusk',
      icon: Sunset,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {items.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
              <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.iconColor}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
