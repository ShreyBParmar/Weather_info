import api from './api';

export const weatherService = {
  // Weather APIs
  getCurrentWeather: async (city) => {
    const response = await api.get('/api/weather/current', {
      params: { city: city.trim() },
    });
    return response.data;
  },

  getForecast: async (city) => {
    const response = await api.get('/api/weather/forecast', {
      params: { city: city.trim() },
    });
    return response.data;
  },

  getSuggestions: async (query) => {
    if (!query || query.trim().length < 2) return [];
    const response = await api.get('/api/weather/suggestions', {
      params: { query: query.trim() },
    });
    return response.data;
  },

  compareWeather: async (cities) => {
    const citiesParam = Array.isArray(cities) ? cities.join(',') : cities;
    const response = await api.get('/api/weather/compare', {
      params: { cities: citiesParam },
    });
    return response.data;
  },

  // Favorite Cities APIs
  getFavorites: async () => {
    const response = await api.get('/api/favorites');
    return response.data;
  },

  addFavorite: async (favoriteData) => {
    const response = await api.post('/api/favorites', favoriteData);
    return response.data;
  },

  removeFavorite: async (favoriteId) => {
    await api.delete(`/api/favorites/${favoriteId}`);
    return true;
  },

  // Search History APIs
  getHistory: async () => {
    const response = await api.get('/api/history');
    return response.data;
  },

  addHistory: async (historyData) => {
    const response = await api.post('/api/history', historyData);
    return response.data;
  },

  clearHistory: async () => {
    await api.delete('/api/history');
    return true;
  },
};
