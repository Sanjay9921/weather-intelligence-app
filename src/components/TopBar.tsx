import React from 'react';
import { TempUnit } from '../types/weather';
import { CloudSun, RefreshCw } from 'lucide-react';

interface TopBarProps {
  unit: TempUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  activeSection,
  onNavigate,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'forecast', label: '7-Day Forecast' },
    { id: 'trends', label: 'Trends & Charts' },
    { id: 'activities', label: 'Activity Planner' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <CloudSun className="w-5 h-5" />
          </div>
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('overview');
            }}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-sky-400 transition-colors"
          >
            Aether Weather
          </a>
        </div>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeSection === item.id
                  ? 'text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary action & unit control */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => unit !== 'C' && onToggleUnit()}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                unit === 'C'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Show Celsius"
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'F' && onToggleUnit()}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                unit === 'F'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Show Fahrenheit"
            >
              °F
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
