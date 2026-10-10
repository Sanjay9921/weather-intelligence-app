import React, { useState, useEffect, useCallback } from 'react';
import { GeoCity, ForecastResponse, TempUnit } from './types/weather';
import { DEFAULT_CITY, fetchForecast, reverseGeocode } from './services/weatherApi';
import { generateRecommendations } from './utils/recommendations';
import { TopBar } from './components/TopBar';
import { SearchSection } from './components/SearchSection';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { Forecast7Day } from './components/Forecast7Day';
import { WeatherCharts } from './components/WeatherCharts';
import { ActivityRecommendationsSection } from './components/ActivityRecommendationsSection';
import { ErrorBanner } from './components/ErrorBanner';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [city, setCity] = useState<GeoCity>(DEFAULT_CITY);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TempUnit>('C');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Load weather forecast for active city
  const loadWeatherData = useCallback(async (targetCity: GeoCity, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage(null);

    try {
      const data = await fetchForecast(targetCity.latitude, targetCity.longitude);
      setForecast(data);
      setSelectedDayIndex(0);
    } catch (err: any) {
      console.error('Failed to fetch forecast:', err);
      setErrorMessage(
        err.message || 'Unable to load weather forecast. Please verify your connection.'
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch on mount with default city (Chennai)
  useEffect(() => {
    loadWeatherData(DEFAULT_CITY);
  }, [loadWeatherData]);

  // Handle city selection
  const handleSelectCity = (newCity: GeoCity) => {
    setCity(newCity);
    loadWeatherData(newCity);
  };

  // Handle Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const detectedCity = await reverseGeocode(latitude, longitude);
          setCity(detectedCity);
          await loadWeatherData(detectedCity);
        } catch {
          const fallbackCity: GeoCity = {
            id: Math.floor(latitude * 1000 + longitude),
            name: 'Local Position',
            latitude,
            longitude,
            country: 'Current Geolocation',
          };
          setCity(fallbackCity);
          await loadWeatherData(fallbackCity);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setSearchError(`Unable to retrieve location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleRefresh = () => {
    loadWeatherData(city, true);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const recommendations = forecast
    ? generateRecommendations(forecast.current, forecast.daily)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Bar adhering to Top Bar Contract */}
      <TopBar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* City Search Bar & Geocoding Section */}
        <section aria-label="City Search">
          <SearchSection
            currentCity={city}
            onSelectCity={handleSelectCity}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLocating={isLocating}
            searchError={searchError}
            onClearSearchError={() => setSearchError(null)}
          />
        </section>

        {/* Global Error Banner */}
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            onRetry={() => loadWeatherData(city)}
            onResetDefault={() => handleSelectCity(DEFAULT_CITY)}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        {/* Loading State Skeleton */}
        {loading && !forecast && (
          <div className="space-y-6">
            <div className="h-64 w-full bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse flex items-center justify-center">
              <div className="flex items-center gap-3 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                <span className="text-sm font-medium">Gathering meteorological telemetry...</span>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 bg-slate-900/40 border border-slate-800/60 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Populated State with Weather Intelligence */}
        {forecast && (
          <>
            {/* 1. Overview: Current Weather Telemetry */}
            <section id="overview" className="scroll-mt-24">
              <CurrentWeatherCard
                city={city}
                current={forecast.current}
                daily={forecast.daily}
                unit={unit}
                timezone={forecast.timezone}
              />
            </section>

            {/* 2. 7-Day Forecast Cards */}
            <section id="forecast" className="scroll-mt-24">
              <Forecast7Day
                daily={forecast.daily}
                unit={unit}
                selectedDayIndex={selectedDayIndex}
                onSelectDay={(idx) => setSelectedDayIndex(idx)}
              />
            </section>

            {/* 3. Interactive Weather Trends (Recharts) */}
            <section id="trends" className="scroll-mt-24">
              <WeatherCharts
                daily={forecast.daily}
                unit={unit}
                selectedDayIndex={selectedDayIndex}
                onSelectDay={(idx) => setSelectedDayIndex(idx)}
              />
            </section>

            {/* 4. Automated Activity & Planning Recommendations */}
            <section id="activities" className="scroll-mt-24">
              <ActivityRecommendationsSection
                recommendations={recommendations}
                cityName={city.name}
              />
            </section>
          </>
        )}
      </main>

      {/* Subtle, unadorned footer adhering to design constitution */}
      <footer className="border-t border-slate-900 py-8 mt-12 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Aether Weather Intelligence</span>
            <span>·</span>
            <span>Unauthenticated Open-Meteo APIs</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>Lat {city.latitude.toFixed(2)}°</span>
            <span>·</span>
            <span>Lon {city.longitude.toFixed(2)}°</span>
            <span>·</span>
            <span>{forecast?.timezone || 'Auto-Timezone'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
