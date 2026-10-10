import React, { useState } from 'react';
import { ActivityRecommendation } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Sparkles, CheckCircle2, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';

interface ActivityRecommendationsSectionProps {
  recommendations: ActivityRecommendation[];
  cityName: string;
}

export const ActivityRecommendationsSection: React.FC<ActivityRecommendationsSectionProps> = ({
  recommendations,
  cityName,
}) => {
  const [filter, setFilter] = useState<'all' | 'optimal' | 'caution'>('all');

  const filteredItems = recommendations.filter((item) => {
    if (filter === 'optimal') return item.status === 'optimal' || item.status === 'good';
    if (filter === 'caution') return item.status === 'caution' || item.status === 'avoid';
    return true;
  });

  const getStatusBadge = (status: ActivityRecommendation['status']) => {
    switch (status) {
      case 'optimal':
        return {
          label: 'Optimal',
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'good':
        return {
          label: 'Favorable',
          bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />,
        };
      case 'caution':
        return {
          label: 'Caution Advised',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'avoid':
        return {
          label: 'Not Recommended',
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span>Smart Activity & Planning Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated lifestyle, athletic, and travel recommendations tuned to current weather in{' '}
            <strong className="text-slate-200">{cityName}</strong>
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Plans ({recommendations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('optimal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'optimal'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Favorable
          </button>
          <button
            type="button"
            onClick={() => setFilter('caution')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'caution'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Caution / Avoid
          </button>
        </div>
      </div>

      {/* Grid of Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const badge = getStatusBadge(item.status);
          return (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900/90 transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                {/* Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs text-slate-400 font-mono">{item.category}</span>
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${badge.bg}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* Title & Icon */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sky-400 group-hover:scale-105 transition-transform shrink-0">
                    <WeatherIcon name={item.icon} className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{item.title}</h3>
                  </div>
                </div>

                {/* Reason */}
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.reason}</p>
              </div>

              {/* Actionable Tip */}
              <div className="pt-3 border-t border-slate-800/80 bg-slate-950/40 -mx-5 -mb-5 p-3.5 rounded-b-xl">
                <div className="text-xs text-slate-400">
                  <strong className="text-sky-300 font-medium">Recommendation:</strong> {item.tip}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
