import React from 'react';
import { AlertCircle, RefreshCw, Key } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  const isKeyError = message?.toLowerCase().includes('api key') || message?.toLowerCase().includes('unauthorized');

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 shadow-sm my-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-1">
            {isKeyError ? 'API Configuration Notice' : 'Unable to Retrieve Weather'}
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed mb-3">
            {message || 'An error occurred while communicating with the weather service.'}
          </p>

          {isKeyError && (
            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 mb-3 space-y-1">
              <p className="font-medium flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                How to set your OpenWeather API key:
              </p>
              <ol className="list-decimal list-inside pl-1 space-y-0.5 text-amber-900">
                <li>Sign up for a free account at <span className="font-mono text-blue-600">openweathermap.org</span>.</li>
                <li>Obtain your API key from your OpenWeather account dashboard.</li>
                <li>Set <span className="font-mono bg-amber-100 px-1 py-0.5 rounded">OPENWEATHER_API_KEY=&lt;key&gt;</span> in the <span className="font-mono">backend/.env</span> file.</li>
                <li>Restart the FastAPI backend.</li>
              </ol>
            </div>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-xl transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
