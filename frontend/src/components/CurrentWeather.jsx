import React from 'react';
import { Star, MapPin, Calendar } from 'lucide-react';
import { formatTemperature } from '../utils/temperature';
import { formatReadableDate } from '../utils/dateFormatter';

export const CurrentWeather = ({
  weather,
  unit,
  onToggleUnit,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
      {/* Background soft ambient blobs */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Location & Date */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5 text-blue-100">
              <MapPin className="w-5 h-5 text-blue-200" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {weather.city_name}
              </h2>
              {weather.country && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-white/20 text-white rounded-full">
                  {weather.country}
                </span>
              )}
            </div>

            {/* Favorite button */}
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2 rounded-full transition ${
                isFavorite
                  ? 'bg-amber-400 text-amber-950 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-950' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-100/90 font-medium">
            <Calendar className="w-4 h-4" />
            <span>{formatReadableDate(weather.timestamp)}</span>
          </div>

          {/* Condition text */}
          <div className="mt-4">
            <p className="text-lg md:text-xl font-medium capitalize text-blue-50">
              {weather.description}
            </p>
            <p className="text-xs text-blue-200 mt-0.5">
              Feels like {formatTemperature(weather.feels_like, unit)}
            </p>
          </div>
        </div>

        {/* Right: Weather icon and temperature */}
        <div className="flex items-center gap-4 self-center md:self-auto">
          <div className="relative">
            <img
              src={weather.icon_url}
              alt={weather.description}
              className="w-24 h-24 md:w-28 md:h-28 object-contain filter drop-shadow-md"
            />
          </div>

          <div className="flex flex-col items-start">
            <div className="flex items-start">
              <span className="text-5xl md:text-6xl font-extrabold tracking-tighter">
                {formatTemperature(weather.temperature, unit).replace(/[°CF]/g, '')}
              </span>
              
              {/* Unit Toggle Switch */}
              <div className="ml-2 flex bg-white/20 backdrop-blur-md rounded-xl p-0.5 border border-white/20">
                <button
                  type="button"
                  onClick={() => unit !== 'C' && onToggleUnit()}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg transition ${
                    unit === 'C' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => unit !== 'F' && onToggleUnit()}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg transition ${
                    unit === 'F' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-blue-100 font-medium mt-1">
              <span>H: {formatTemperature(weather.temp_max, unit)}</span>
              <span>•</span>
              <span>L: {formatTemperature(weather.temp_min, unit)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
