import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Fetching weather data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
      <p className="text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 rounded w-1/3"></div>
      <div className="h-12 bg-slate-200 rounded w-1/2"></div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="h-16 bg-slate-100 rounded"></div>
        <div className="h-16 bg-slate-100 rounded"></div>
      </div>
    </div>
  );
};
