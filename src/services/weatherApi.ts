import { GeoCity, ForecastResponse } from '../types/weather';

export const DEFAULT_CITY: GeoCity = {
  id: 1264527,
  name: 'Chennai',
  latitude: 13.0827,
  longitude: 80.2707,
  country: 'India',
  country_code: 'IN',
  admin1: 'Tamil Nadu',
  timezone: 'Asia/Kolkata',
};

export const POPULAR_CITIES: GeoCity[] = [
  DEFAULT_CITY,
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
    timezone: 'Europe/London',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
    timezone: 'Asia/Tokyo',
  },
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7143,
    longitude: -74.006,
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
    timezone: 'America/New_York',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.8534,
    longitude: 2.3488,
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
    timezone: 'Europe/Paris',
  },
  {
    id: 5391959,
    name: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    country: 'United States',
    country_code: 'US',
    admin1: 'California',
    timezone: 'America/Los_Angeles',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8678,
    longitude: 151.2073,
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
    timezone: 'Australia/Sydney',
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.0772,
    longitude: 55.3093,
    country: 'United Arab Emirates',
    country_code: 'AE',
    admin1: 'Dubai',
    timezone: 'Asia/Dubai',
  },
];

export async function searchCities(query: string): Promise<GeoCity[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=5&language=en&format=json`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Geocoding service unavailable (status ${response.status})`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country || '',
    country_code: item.country_code || '',
    admin1: item.admin1 || '',
    timezone: item.timezone || 'auto',
  }));
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastResponse> {
  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Forecast service unavailable (status ${response.status})`);
  }

  const data = await response.json();
  if (!data.current || !data.daily) {
    throw new Error('Incomplete weather forecast payload returned from Open-Meteo');
  }

  return data as ForecastResponse;
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoCity> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
    if (res.ok) {
      const data = await res.json();
      const city = data.address?.city || data.address?.town || data.address?.municipality || data.address?.village || data.address?.state || 'Current Location';
      const country = data.address?.country || '';
      const country_code = data.address?.country_code ? data.address.country_code.toUpperCase() : '';
      return {
        id: Math.floor(lat * 1000 + lon),
        name: city,
        latitude: lat,
        longitude: lon,
        country,
        country_code,
      };
    }
  } catch {
    // fallback
  }

  return {
    id: Math.floor(lat * 1000 + lon),
    name: 'Your Location',
    latitude: lat,
    longitude: lon,
    country: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
  };
}
