import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { weatherService } from '../services/weatherService';

export const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced autocomplete suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await weatherService.getSuggestions(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    setIsOpen(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    const cityName = suggestion.name;
    setQuery(cityName);
    onSearch(cityName);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search city (e.g. London, Tokyo, New York)..."
          disabled={loading}
          className="w-full pl-12 pr-24 py-3.5 bg-white text-slate-800 placeholder-slate-400 rounded-2xl border border-slate-200/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <button
              key={`${item.name}-${item.country}-${idx}`}
              onClick={() => handleSelectSuggestion(item)}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-blue-50/60 transition flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-medium text-slate-800">{item.name}</span>
                {item.state && <span className="text-xs text-slate-400">{item.state}</span>}
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                {item.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
