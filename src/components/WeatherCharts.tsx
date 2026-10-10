import React, { useState } from 'react';
import { DailyWeather, TempUnit } from '../types/weather';
import { getWeatherMeta, convertTemp, formatTemp } from '../utils/weatherCodes';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, Droplets, Thermometer } from 'lucide-react';

interface WeatherChartsProps {
  daily: DailyWeather;
  unit: TempUnit;
  selectedDayIndex: number;
  onSelectDay: (idx: number) => void;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  daily,
  unit,
  selectedDayIndex,
  onSelectDay,
}) => {
  const [chartMode, setChartMode] = useState<'temp' | 'precip'>('temp');

  const chartData = daily.time.slice(0, 7).map((dateStr, idx) => {
    const date = new Date(dateStr + 'T00:00:00');
    const dayLabel = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const maxC = daily.temperature_2m_max[idx];
    const minC = daily.temperature_2m_min[idx];
    const maxVal = convertTemp(maxC, unit);
    const minVal = convertTemp(minC, unit);
    const rainSum = daily.precipitation_sum[idx] ?? 0;
    const rainProb =
      daily.precipitation_probability_max?.[idx] ?? Math.min(100, Math.round(rainSum * 15));
    const code = daily.weather_code[idx];
    const meta = getWeatherMeta(code, 1);

    return {
      index: idx,
      day: dayLabel,
      fullDate,
      maxTemp: maxVal,
      minTemp: minVal,
      maxRawC: maxC,
      minRawC: minC,
      rainSum,
      rainProb,
      condition: meta.label,
    };
  });

  const CustomTempTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-44">
          <div className="font-semibold text-white flex items-center justify-between pb-1 border-b border-slate-800">
            <span>
              {data.day} ({data.fullDate})
            </span>
            <span className="text-slate-400 font-normal">{data.condition}</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-emerald-400">High:</span>
            <span className="font-semibold tabular-nums text-white">
              {formatTemp(data.maxRawC, unit)}
            </span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-cyan-400">Low:</span>
            <span className="font-semibold tabular-nums text-white">
              {formatTemp(data.minRawC, unit)}
            </span>
          </div>
          <div className="flex items-center justify-between font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>Precipitation:</span>
            <span className="tabular-nums">
              {data.rainSum} mm ({data.rainProb}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPrecipTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-44">
          <div className="font-semibold text-white flex items-center justify-between pb-1 border-b border-slate-800">
            <span>
              {data.day} ({data.fullDate})
            </span>
            <span className="text-slate-400 font-normal">{data.condition}</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-blue-400">Rain Accumulation:</span>
            <span className="font-semibold tabular-nums text-white">{data.rainSum} mm</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-sky-300">Precipitation Chance:</span>
            <span className="font-semibold tabular-nums text-white">{data.rainProb}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 shadow-lg backdrop-blur-sm space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <span>Interactive Weather Trends</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous multi-day projections for temperature curves and rainfall probabilities
          </p>
        </div>

        {/* Mode Toggle Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              chartMode === 'temp'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature (°{unit})</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('precip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              chartMode === 'precip'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'temp' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number' && e.activeTooltipIndex >= 0) {
                  onSelectDay(e.activeTooltipIndex);
                }
              }}
            >
              <defs>
                <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                unit={`°`}
              />
              <Tooltip content={<CustomTempTooltip />} />
              <Area
                type="monotone"
                dataKey="maxTemp"
                name="High"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#maxTempGrad)"
                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                name="Low"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#minTempGrad)"
                activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
              onClick={(e) => {
                if (e && typeof e.activeTooltipIndex === 'number' && e.activeTooltipIndex >= 0) {
                  onSelectDay(e.activeTooltipIndex);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                unit="mm"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip content={<CustomPrecipTooltip />} />
              <Bar
                yAxisId="left"
                dataKey="rainSum"
                name="Rain Sum (mm)"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="rainProb"
                name="Rain Chance (%)"
                fill="#818cf8"
                radius={[4, 4, 0, 0]}
                opacity={0.6}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
        {chartMode === 'temp' ? (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Daily High Temp (°{unit})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Daily Low Temp (°{unit})</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
              <span>Precipitation Accumulation (mm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400 opacity-60" />
              <span>Probability of Rain (%)</span>
            </span>
          </div>
        )}

        <span className="hidden sm:inline">Data via Open-Meteo High-Resolution Model</span>
      </div>
    </div>
  );
};
