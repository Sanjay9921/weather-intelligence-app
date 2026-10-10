# Aether Weather Intelligence

A modern, responsive, and data-dense Weather Intelligence web application built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**. The app delivers real-time meteorological telemetry, 7-day extended forecasts, interactive temperature and precipitation trend charts, and automated lifestyle/activity recommendations—powered entirely by public, unauthenticated **Open-Meteo** APIs without requiring any API keys.

---

## 🎯 Project Objective

The objective of **Aether Weather Intelligence** is to provide accurate, clutter-free atmospheric forecasts and actionable planning insights for any global location. Unlike conventional ad-heavy weather portals, Aether delivers:

1. **Sub-second Global Geocoding & Search**: Instant lookups for any city, town, or municipality worldwide.
2. **Comprehensive Current Conditions**: Real-time temperature, apparent ("feels like") temperature, relative humidity, wind velocity, precipitation accumulations, and daylight tracking.
3. **7-Day Atmospheric Forecast**: Daily temperature spreads with visual thermal range bars and precipitation probabilities.
4. **Interactive Multi-Metric Trends**: Dynamic graphical visualization of temperature trajectories and rainfall chances using Recharts.
5. **Contextual Activity Recommendations**: Rule-based planning recommendations tailored to outdoor running, dining, hiking, photography, transit conditions, and daily apparel.
6. **Zero-Configuration Accessibility**: Operates 100% out of the box with zero third-party API key registration or billing setup.

---

## ✨ Key Features

- **Global City Search & Geocoding**:
  - Live search with debounced autocomplete query suggestions.
  - Keyboard navigation (`Up`/`Down`/`Enter`) and clear controls.
  - One-click shortcuts for prominent world cities (Chennai, London, Tokyo, New York, Paris, San Francisco, Sydney, Dubai).
  - Browser Geolocation API support ("My Location") with reverse geocoding.
- **Current Meteorological Telemetry**:
  - Actual & Apparent ("Feels like") temperatures.
  - Wind speed (km/h) with atmospheric comfort ratings.
  - Relative humidity percentage & precipitation accumulation (mm).
  - Day/night indicator and localized timezone clock.
- **7-Day Weather Forecast**:
  - Cards presenting daily high and low temperatures with proportional gradient range indicators.
  - WMO weather code interpretation with dedicated Lucide iconography.
  - Precipitation risk percentage and expected volume.
- **Interactive Visual Trend Charts**:
  - Powered by **Recharts**.
  - **Temperature Mode**: High and low temperature gradient curves with smooth interpolation.
  - **Precipitation Mode**: Dual-axis bar charts comparing rainfall accumulation (mm) against probability (%).
  - Interactive day selection synchronizing cards and chart points.
- **Automated Activity & Planning Engine**:
  - Real-time evaluations across 8 activity categories:
    - Running & Cycling
    - City Exploration & Walking Tours
    - Outdoor Dining & Rooftops
    - Hiking & Mountain Trails
    - Landscape & Drone Photography
    - Indoor Cultural & Museums
    - Commute & Travel Advisory
    - Wardrobe & Gear Guide
  - Evaluates thermal index, precipitation volume, wind gust velocity, and humidity with actionable tips.
- **Resilience & Unit Flexibility**:
  - Default city initialized to **Chennai, India** on first load.
  - Explicit error handling for unknown queries or network interruptions with retry and reset triggers.
  - Instant unit switching between Celsius (**°C**) and Fahrenheit (**°F**).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Weather APIs** | [Open-Meteo Geocoding & Forecast APIs](https://open-meteo.com/) (Public, Free, Unauthenticated) |

---

## 📡 APIs & Data Sources

The application communicates directly with the following Open-Meteo endpoints:

1. **Geocoding API**:
   ```
   https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=5&language=en&format=json
   ```
   Retrieves latitude, longitude, country, administrative region, and timezone coordinates.

2. **Forecast API**:
   ```
   https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto
   ```
   Streams high-resolution current observations and 7-day daily forecast projections.

*No API keys, tokens, or registration are required.*

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **npm** (included with Node.js) or **pnpm** / **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Once started, open your browser and navigate to:
```
http://localhost:3000
```
*(or the port indicated in your terminal output).*

---

## 📦 Available Scripts

In the project directory, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite development server on port `3000` with local network exposure |
| `npm run build` | Compiles TypeScript and creates an optimized production bundle in `/dist` |
| `npm run preview` | Locally serves the production build for testing |
| `npm run lint` | Runs `tsc --noEmit` to validate all TypeScript types and imports |
| `npm run clean` | Removes build artifacts (`dist` folder) |

---

## 📁 Project Structure

```
├── index.html                   # HTML entry point with metadata & web fonts
├── package.json                 # Dependencies and build scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite & Tailwind CSS plugins configuration
├── src/
│   ├── main.tsx                 # React application mounting point
│   ├── App.tsx                  # Primary layout and state coordinator
│   ├── index.css                # Global CSS with Tailwind layer imports
│   ├── types/
│   │   └── weather.ts           # TypeScript interfaces for weather and geocoding data
│   ├── services/
│   │   └── weatherApi.ts        # Open-Meteo API fetch functions & presets
│   ├── utils/
│   │   ├── weatherCodes.ts      # WMO weather code mapping & temperature conversions
│   │   └── recommendations.ts  # Automated weather-driven activity recommendation logic
│   └── components/
│       ├── TopBar.tsx           # Navigation header, unit switcher (°C/°F), and refresh
│       ├── SearchSection.tsx    # Debounced search bar, city presets, and geolocation
│       ├── CurrentWeatherCard.tsx # Detailed current telemetry and live metrics
│       ├── Forecast7Day.tsx     # 7-day cards with visual temperature spread bars
│       ├── WeatherCharts.tsx    # Interactive Recharts temperature & rain trends
│       ├── ActivityRecommendationsSection.tsx # Smart activity advice cards
│       ├── WeatherIcon.tsx      # SVG weather condition icons
│       └── ErrorBanner.tsx      # Edge-case and connection error alerts
```

---

## 📄 License

This project is open source and available under the [Apache-2.0 License](LICENSE).