import React, { useState, useEffect, useRef } from 'react';
import { GeoCity } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';

interface SearchSectionProps {
  currentCity: GeoCity;
  onSelectCity: (city: GeoCity) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  searchError: string | null;
  onClearSearchError: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  currentCity,
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
  searchError,
  onClearSearchError,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [noResultsForQuery, setNoResultsForQuery] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    setQuery(val);
    setHighlightedIndex(-1);
    onClearSearchError();
    setNoResultsForQuery(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const found = await searchCities(val);
        setResults(found);
        setIsOpen(true);
        if (found.length === 0) {
          setNoResultsForQuery(val.trim());
        } else {
          setNoResultsForQuery(null);
        }
      } catch {
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsSearching(false);
      }
    }, 280);
  };

  const handleSelect = (city: GeoCity) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setNoResultsForQuery(null);
    onClearSearchError();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && results[highlightedIndex]) {
        handleSelect(results[highlightedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      } else if (query.trim().length >= 2) {
        // Trigger explicit search
        setIsSearching(true);
        searchCities(query.trim())
          .then((found) => {
            if (found.length > 0) {
              handleSelect(found[0]);
            } else {
              setNoResultsForQuery(query.trim());
            }
          })
          .catch(() => {
            setNoResultsForQuery(query.trim());
          })
          .finally(() => setIsSearching(false));
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full space-y-4" ref={containerRef}>
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search any global city (e.g. Chennai, London, Tokyo, New York)..."
            className="w-full pl-12 pr-28 py-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm shadow-inner transition-all"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setIsOpen(false);
                  setNoResultsForQuery(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
              title="Use current geolocation"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">My Location</span>
            </button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="p-1.5 space-y-0.5 max-h-72 overflow-y-auto">
              {results.map((city, idx) => (
                <button
                  key={`${city.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                    highlightedIndex === idx
                      ? 'bg-slate-800/90 text-white'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-slate-100 flex items-center gap-1.5">
                        <span>{city.name}</span>
                        {city.admin1 && (
                          <span className="text-xs text-slate-400 font-normal">
                            · {city.admin1}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {city.country} · {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono shrink-0">
                    {city.country_code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* No Results Warning */}
      {noResultsForQuery && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-200 text-xs flex items-center justify-between gap-3">
          <span>
            No matching city found for <strong>"{noResultsForQuery}"</strong>. Try checking the spelling or searching another city name.
          </span>
          <button
            onClick={() => setNoResultsForQuery(null)}
            className="text-amber-400 hover:text-amber-300 underline font-medium shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Popular Cities Quick Select Bar */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
        <span className="shrink-0 font-medium text-slate-400">Quick select:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {POPULAR_CITIES.map((city) => {
            const isCurrent = currentCity.id === city.id || (
              Math.abs(currentCity.latitude - city.latitude) < 0.05 &&
              Math.abs(currentCity.longitude - city.longitude) < 0.05
            );
            return (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelect(city)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  isCurrent
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:text-white'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
