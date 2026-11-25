import React from 'react';
import { Calendar, CloudRain, Wind } from 'lucide-react';
import { formatTemperature } from '../utils/temperature';

export const DailyForecast = ({ daily, unit }) => {
  if (!daily || daily.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-indigo-600" />
        <h3 className="text-base font-bold text-slate-800">5-Day Forecast</h3>
        <span className="text-xs text-slate-400 font-medium ml-auto">Daily Outlook</span>
      </div>

      <div className="divide-y divide-slate-100">
        {daily.map((item, idx) => (
          <div
            key={idx}
            className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-xl transition"
          >
            {/* Day name & date */}
            <div className="w-28 shrink-0">
              <p className="text-sm font-semibold text-slate-800">{item.day_name}</p>
              <p className="text-xs text-slate-400">{item.date}</p>
            </div>

            {/* Condition & icon */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img
                src={item.icon_url}
                alt={item.description}
                className="w-10 h-10 object-contain shrink-0"
              />
              <div className="truncate">
                <p className="text-sm font-medium text-slate-700 truncate">{item.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  {item.pop > 0 && (
                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                      <CloudRain className="w-3 h-3" />
                      {Math.round(item.pop * 100)}%
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    {item.wind_speed} m/s
                  </span>
                </div>
              </div>
            </div>

            {/* Min / Max Temperature Bar */}
            <div className="flex items-center gap-3 shrink-0 text-right">
              <span className="text-xs font-medium text-slate-400 w-12">
                {formatTemperature(item.temp_min, unit)}
              </span>
              <div className="hidden sm:block w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                <div className="absolute inset-y-0 left-2 right-2 bg-gradient-to-r from-blue-400 to-amber-400 rounded-full" />
              </div>
              <span className="text-sm font-bold text-slate-800 w-12">
                {formatTemperature(item.temp_max, unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
