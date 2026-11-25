import React from 'react';
import { Star, MapPin, Trash2, ArrowUpRight } from 'lucide-react';

export const FavoriteCities = ({ favorites, onSelectCity, onRemoveFavorite }) => {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-3">
          <Star className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-slate-800 mb-1">No Favorite Cities Yet</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Save your frequently checked cities by clicking the star icon on any city's weather card.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
        <h3 className="text-base font-bold text-slate-800">Favorite Cities</h3>
        <span className="text-xs text-slate-400 font-medium ml-auto">{favorites.length} saved</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="group relative bg-slate-50/70 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 transition flex items-center justify-between gap-3 shadow-none hover:shadow-sm"
          >
            <button
              type="button"
              onClick={() => onSelectCity(fav.city_name)}
              className="flex items-center gap-2.5 text-left flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition">
                  {fav.city_name}
                </p>
                {fav.country && (
                  <p className="text-xs text-slate-400 font-medium">{fav.country}</p>
                )}
              </div>
            </button>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onSelectCity(fav.city_name)}
                title="View weather"
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onRemoveFavorite(fav.id)}
                title="Remove from favorites"
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
