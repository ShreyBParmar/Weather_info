import React from 'react';
import { CloudRain, Wind, Clock } from 'lucide-react';
import { formatTemperature } from '../utils/temperature';

export const HourlyForecast = ({ hourly, unit }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-base font-bold text-slate-800">Hourly Forecast</h3>
        <span className="text-xs text-slate-400 font-medium ml-auto">Next 24-36 Hours</span>
      </div>

      {/* Horizontally scrollable container */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {hourly.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-between p-3.5 bg-slate-50/80 hover:bg-blue-50/50 rounded-2xl border border-slate-100 min-w-[105px] shrink-0 transition"
          >
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              {item.time_label}
            </span>

            <img
              src={item.icon_url}
              alt={item.description}
              className="w-12 h-12 object-contain my-1"
            />

            <span className="text-base font-bold text-slate-800">
              {formatTemperature(item.temperature, unit)}
            </span>

            <span className="text-[11px] font-medium text-slate-500 capitalize truncate max-w-[90px] text-center">
              {item.condition}
            </span>

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 w-full justify-center text-[10px] text-slate-400">
              {item.pop > 0 && (
                <div className="flex items-center gap-0.5 text-blue-600 font-medium" title="Precipitation Probability">
                  <CloudRain className="w-3 h-3" />
                  <span>{Math.round(item.pop * 100)}%</span>
                </div>
              )}
              <div className="flex items-center gap-0.5 text-slate-500" title="Wind Speed">
                <Wind className="w-3 h-3" />
                <span>{item.wind_speed}m/s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
