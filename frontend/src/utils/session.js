/**
 * Session ID manager to isolate user search history and favorites
 */

export const getSessionId = () => {
  let sessionId = localStorage.getItem('weather_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    localStorage.setItem('weather_session_id', sessionId);
  }
  return sessionId;
};
