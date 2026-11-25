import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoriteCities } from '../components/FavoriteCities';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { weatherService } from '../services/weatherService';

export const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message || 'Failed to load favorite cities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleSelectCity = (cityName) => {
    navigate(`/?city=${encodeURIComponent(cityName)}`);
  };

  const handleRemoveFavorite = async (id) => {
    try {
      await weatherService.removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800">
          Saved Favorites
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage your pinned cities for one-click weather tracking
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadFavorites} />}
      {loading ? (
        <Loading message="Loading favorite cities..." />
      ) : (
        <FavoriteCities
          favorites={favorites}
          onSelectCity={handleSelectCity}
          onRemoveFavorite={handleRemoveFavorite}
        />
      )}
    </div>
  );
};
