import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchHistory } from '../components/SearchHistory';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { weatherService } from '../services/weatherService';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to load search history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSelectCity = (cityName) => {
    navigate(`/?city=${encodeURIComponent(cityName)}`);
  };

  const handleClearHistory = async () => {
    try {
      await weatherService.clearHistory();
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear search history:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800">
          Search History
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Review and re-search your recently checked destinations
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadHistory} />}
      {loading ? (
        <Loading message="Loading search history..." />
      ) : (
        <SearchHistory
          history={history}
          onSelectCity={handleSelectCity}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
};
