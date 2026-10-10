import React from 'react';
import { GeoCity, CurrentWeather, DailyWeather, TempUnit } from '../types/weather';
import { getWeatherMeta, formatTemp } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import {
  Wind,
  Droplets,
  Thermometer,
  CloudRain,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  SunMedium,
  Compass,
} from 'lucide-react';

interface CurrentWeatherCardProps {
  city: GeoCity;
  current: CurrentWeather;
  daily: DailyWeather;
  unit: TempUnit;
  timezone: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  current,
  daily,
  unit,
  timezone,
}) => {
  const meta = getWeatherMeta(current.weather_code, current.is_day);
  const todayHigh = daily.temperature_2m_max[0];
  const todayLow = daily.temperature_2m_min[0];
  const todayRain = daily.precipitation_sum[0];

  // Format local observation time
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone.includes('/') ? timezone : undefined,
  });

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${meta.bgGradient} bg-slate-900/90 p-6 md:p-8 backdrop-blur-sm shadow-xl`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-8">
        {/* Header: Location & Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
              </span>
              <span className="text-slate-600">·</span>
              <span>{timezone}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {city.name}
              {city.admin1 && city.admin1 !== city.name && (
                <span className="text-slate-400 font-normal text-lg sm:text-xl ml-2">
                  , {city.admin1}
                </span>
              )}
              {city.country && (
                <span className="text-slate-400 font-normal text-lg sm:text-xl ml-2">
                  · {city.country}
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 self-start sm:self-auto font-mono">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedTime} Local</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1">
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              <span>{current.is_day ? 'Daylight' : 'Night'}</span>
            </div>
          </div>
        </div>

        {/* Primary Weather Reading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Temperature & Condition (Left 7 cols) */}
          <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 shadow-inner flex items-center justify-center shrink-0">
              <WeatherIcon name={meta.iconName} className={`w-16 h-16 sm:w-20 sm:h-20 ${meta.color}`} />
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl sm:text-7xl font-bold tracking-tight text-white tabular-nums">
                  {formatTemp(current.temperature_2m, unit)}
                </span>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-slate-300 font-medium">
                    <span>Feels like</span>
                    <span className="text-sky-300 font-mono font-semibold tabular-nums">
                      {formatTemp(current.apparent_temperature, unit)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-400">
                    <span className="flex items-center text-emerald-400 tabular-nums">
                      <ArrowUp className="w-3 h-3 mr-0.5" />
                      {formatTemp(todayHigh, unit)}
                    </span>
                    <span className="text-slate-600">/</span>
                    <span className="flex items-center text-cyan-400 tabular-nums">
                      <ArrowDown className="w-3 h-3 mr-0.5" />
                      {formatTemp(todayLow, unit)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                  <span>{meta.label}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{meta.description}</p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid (Right 5 cols) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            {/* Wind Speed */}
            <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400">Wind Speed</div>
                <div className="text-sm font-semibold text-white font-mono tabular-nums">
                  {current.wind_speed_10m} km/h
                </div>
              </div>
            </div>

            {/* Relative Humidity */}
            <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400">Humidity</div>
                <div className="text-sm font-semibold text-white font-mono tabular-nums">
                  {current.relative_humidity_2m}%
                </div>
              </div>
            </div>

            {/* Precipitation */}
            <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400">Precipitation</div>
                <div className="text-sm font-semibold text-white font-mono tabular-nums">
                  {current.precipitation} mm
                </div>
              </div>
            </div>

            {/* Daily Rain Total */}
            <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <Thermometer className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400">Rain Expected</div>
                <div className="text-sm font-semibold text-white font-mono tabular-nums">
                  {todayRain} mm total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
