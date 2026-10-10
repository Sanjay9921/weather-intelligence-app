import React from 'react';
import { DailyWeather, TempUnit } from '../types/weather';
import { getWeatherMeta, formatTemp } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface Forecast7DayProps {
  daily: DailyWeather;
  unit: TempUnit;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({
  daily,
  unit,
  selectedDayIndex,
  onSelectDay,
}) => {
  // Find global min and max over the 7 days to calculate proportional temperature range bars
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempSpan = Math.max(1, allMax - allMin);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            <span>7-Day Weather Forecast</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily temperature spectrum, atmospheric conditions, and precipitation risks
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono hidden sm:block">
          Click any day to inspect details
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {daily.time.slice(0, 7).map((dateStr, idx) => {
          const date = new Date(dateStr + 'T00:00:00');
          const isToday = idx === 0;
          const dayName = isToday
            ? 'Today'
            : date.toLocaleDateString('en-US', { weekday: 'short' });
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const code = daily.weather_code[idx];
          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const rainSum = daily.precipitation_sum[idx] ?? 0;
          const rainProb = daily.precipitation_probability_max?.[idx] ?? Math.min(100, Math.round(rainSum * 15));
          const meta = getWeatherMeta(code, 1);
          const isSelected = selectedDayIndex === idx;

          // Bar calculation
          const leftPct = Math.max(0, Math.min(100, ((minTemp - allMin) / tempSpan) * 100));
          const rightPct = Math.max(0, Math.min(100, ((allMax - maxTemp) / tempSpan) * 100));

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-4 group ${
                isSelected
                  ? 'bg-slate-800/90 border-sky-500/60 shadow-lg ring-1 ring-sky-500/30'
                  : 'bg-slate-900/60 hover:bg-slate-800/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Day & Date Header */}
              <div className="flex items-center justify-between w-full">
                <div>
                  <div
                    className={`text-sm font-semibold ${
                      isToday ? 'text-sky-400' : 'text-slate-200'
                    }`}
                  >
                    {dayName}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{formattedDate}</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 group-hover:scale-105 transition-transform">
                  <WeatherIcon name={meta.iconName} className={`w-5 h-5 ${meta.color}`} />
                </div>
              </div>

              {/* Weather Condition Label */}
              <div className="min-h-9 flex flex-col justify-center">
                <div className="text-xs font-medium text-slate-200 line-clamp-1">
                  {meta.label}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
                  <Droplets className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>{rainProb}% rain</span>
                  {rainSum > 0 && <span>· {rainSum}mm</span>}
                </div>
              </div>

              {/* Temperature High / Low */}
              <div className="w-full pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="flex items-center text-cyan-400 tabular-nums font-medium">
                    <ArrowDown className="w-3 h-3 mr-0.5" />
                    {formatTemp(minTemp, unit)}
                  </span>
                  <span className="flex items-center text-emerald-400 tabular-nums font-semibold">
                    <ArrowUp className="w-3 h-3 mr-0.5" />
                    {formatTemp(maxTemp, unit)}
                  </span>
                </div>

                {/* Visual Relative Spread Bar */}
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex items-center p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                    style={{
                      marginLeft: `${leftPct}%`,
                      marginRight: `${rightPct}%`,
                      width: `${Math.max(12, 100 - leftPct - rightPct)}%`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
