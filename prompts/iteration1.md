**Build a clean, responsive Weather Intelligence web application using React, Vite, and Tailwind CSS.**

**Core Features Required:**

1. **City Search & Selection:**
  * Include a search input bar allowing users to search for any city globally.
  * Fetch city coordinates (latitude, longitude, city name, country) using the public Open-Meteo Geocoding API: `[suspicious link removed]{city_name}&amp;count=5&amp;language=en&amp;format=json`.
2. **Current Weather Display:**
  * Fetch live weather data using the Open-Meteo Forecast API: `[suspicious link removed]{lat}&amp;longitude={lon}¤t=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&amp;daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&amp;timezone=auto`.
  * Display current temperature (°C), "feels like" temperature, wind speed, relative humidity, and weather conditions with appropriate visual icons.
3. **7-Day Weather Forecast:**
  * Display a 7-day forecast presenting daily high/low temperatures, expected weather conditions, and precipitation probabilities using clean forecast cards.
4. **Interactive Weather Charts:**
  * Render a visual chart showing temperature trends over the upcoming days using Recharts or Chart.js.
5. **Planning &amp; Activity Recommendations:**
  * Generate smart, automated activity recommendations based on weather conditions (e.g., outdoor recommendations for sunny weather, indoor suggestions for rain/extreme temperatures).
6. **Error &amp; Edge-Case Handling:**
  * Display a clear "City not found" error banner if an invalid search query is entered or if the API call fails.
  * Include a initial default city (e.g., Chennai or London) on page load.

**Technical Constraints:**

* Rely strictly on public, unauthenticated Open-Meteo APIs — **do not require or prompt for any API keys**