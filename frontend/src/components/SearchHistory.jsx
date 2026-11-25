import React from 'react';
import { History, Clock, Trash2, ArrowUpRight } from 'lucide-react';

export const SearchHistory = ({ history, onSelectCity, onClearHistory }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-3">
          <History className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-slate-800 mb-1">No Search History</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Cities you search for will appear here for quick access.
        </p>
      </div>
    );
  }

  const formatSearchTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-600" />
          <h3 className="text-base font-bold text-slate-800">Recent Searches</h3>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {history.map((item) => (
          <div
            key={item.id}
            className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition group"
          >
            <button
              type="button"
              onClick={() => onSelectCity(item.city_name)}
              className="flex items-center gap-3 text-left flex-1 min-w-0"
            >
              <div className="p-2 bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600 rounded-xl transition">
                <Clock className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition truncate">
                  {item.city_name}
                </p>
                {item.country && (
                  <p className="text-xs text-slate-400">{item.country}</p>
                )}
              </div>
            </button>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400">
                {formatSearchTime(item.searched_at)}
              </span>
              <button
                type="button"
                onClick={() => onSelectCity(item.city_name)}
                className="p-1.5 text-slate-400 group-hover:text-blue-600 rounded-lg transition"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
