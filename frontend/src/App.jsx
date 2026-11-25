import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import {
  CloudSun,
  LayoutDashboard,
  Star,
  History as HistoryIcon,
  GitCompare,
} from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Favorites } from './pages/Favorites';
import { History } from './pages/History';
import { Compare } from './pages/Compare';

export default function App() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/favorites', label: 'Favorites', icon: Star },
    { to: '/history', label: 'History', icon: HistoryIcon },
    { to: '/compare', label: 'Compare', icon: GitCompare },
  ];

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50/80 flex flex-col selection:bg-blue-600 selection:text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* App Brand */}
              <NavLink to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                  <CloudSun className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">
                    SkyCast
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase block">
                    Weather Intelligence
                  </span>
                </div>
              </NavLink>

              {/* Navigation links */}
              <nav className="flex items-center gap-1 sm:gap-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`
                      }
                    >
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<History />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © {new Date().getFullYear()} SkyCast Weather App. Real-time meteorological intelligence.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span>FastAPI Backend</span>
              <span>•</span>
              <span>React + Vite</span>
              <span>•</span>
              <span>PostgreSQL & SQLAlchemy</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
