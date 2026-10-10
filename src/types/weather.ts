export interface GeoCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  time: string;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max?: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  elevation?: number;
  current: CurrentWeather;
  daily: DailyWeather;
}

export type TempUnit = 'C' | 'F';

export interface ActivityRecommendation {
  id: string;
  category: string;
  title: string;
  status: 'optimal' | 'good' | 'caution' | 'avoid';
  score: number; // 0-100
  reason: string;
  tip: string;
  icon: string;
}
