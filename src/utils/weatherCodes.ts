export interface WeatherMeta {
  code: number;
  label: string;
  description: string;
  iconName: 'Sun' | 'Moon' | 'CloudSun' | 'CloudMoon' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudLightning' | 'Snowflake' | 'CloudHail';
  color: string;
  bgGradient: string;
}

export function getWeatherMeta(code: number, isDay = 1): WeatherMeta {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright and sunny skies' : 'Starlit and cloudless',
        iconName: isDay ? 'Sun' : 'Moon',
        color: isDay ? 'text-amber-400' : 'text-indigo-300',
        bgGradient: isDay ? 'from-amber-500/20 via-sky-500/10 to-transparent' : 'from-indigo-900/40 via-slate-900/20 to-transparent',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: 'Occasional light cloud wisps',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        color: isDay ? 'text-amber-300' : 'text-slate-300',
        bgGradient: 'from-sky-500/15 via-slate-900/10 to-transparent',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered cloud cover with sunny breaks',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        color: 'text-sky-300',
        bgGradient: 'from-blue-600/15 via-slate-900/10 to-transparent',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Dense cloud canopy covering the sky',
        iconName: 'Cloud',
        color: 'text-slate-300',
        bgGradient: 'from-slate-700/20 via-slate-900/15 to-transparent',
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 45 ? 'Fog' : 'Depositing Rime Fog',
        description: 'Reduced visibility and high moisture in air',
        iconName: 'CloudFog',
        color: 'text-slate-300',
        bgGradient: 'from-slate-600/20 via-slate-900/20 to-transparent',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Heavy Drizzle',
        description: 'Fine mist and gentle droplet fall',
        iconName: 'CloudDrizzle',
        color: 'text-teal-300',
        bgGradient: 'from-teal-600/20 via-slate-900/20 to-transparent',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Sub-zero freezing mist forming surface ice',
        iconName: 'CloudDrizzle',
        color: 'text-cyan-300',
        bgGradient: 'from-cyan-700/25 via-slate-900/20 to-transparent',
      };
    case 61:
    case 63:
    case 65:
      return {
        code,
        label: code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        description: code === 65 ? 'Torrential precipitation and downpour' : 'Sustained steady rainfall',
        iconName: 'CloudRain',
        color: 'text-blue-400',
        bgGradient: 'from-blue-600/25 via-slate-900/20 to-transparent',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Liquid precipitation freezing on cold ground',
        iconName: 'CloudRain',
        color: 'text-cyan-400',
        bgGradient: 'from-cyan-800/30 via-slate-900/20 to-transparent',
      };
    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        description: 'Crystalline snow accumulations on ground',
        iconName: 'Snowflake',
        color: 'text-sky-200',
        bgGradient: 'from-sky-300/20 via-slate-900/20 to-transparent',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Minute opaque white ice grains',
        iconName: 'Snowflake',
        color: 'text-sky-200',
        bgGradient: 'from-sky-300/20 via-slate-900/20 to-transparent',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 80 ? 'Light Showers' : code === 81 ? 'Moderate Showers' : 'Violent Rain Showers',
        description: 'Intermittent rapid rain bursts with gusty winds',
        iconName: 'CloudRain',
        color: 'text-indigo-400',
        bgGradient: 'from-indigo-600/25 via-slate-900/20 to-transparent',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Sudden bursts of snow flurry with shifting winds',
        iconName: 'Snowflake',
        color: 'text-sky-200',
        bgGradient: 'from-blue-400/20 via-slate-900/20 to-transparent',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Atmospheric electrical storms with lightning strikes',
        iconName: 'CloudLightning',
        color: 'text-amber-400',
        bgGradient: 'from-amber-600/30 via-purple-900/20 to-transparent',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        description: 'Severe electrical storm with damaging hail pellets',
        iconName: 'CloudHail',
        color: 'text-red-400',
        bgGradient: 'from-red-600/30 via-purple-900/30 to-transparent',
      };
    default:
      return {
        code,
        label: 'Variable Sky',
        description: 'Atmospheric conditions standard',
        iconName: 'Cloud',
        color: 'text-slate-300',
        bgGradient: 'from-slate-700/20 via-slate-900/20 to-transparent',
      };
  }
}

export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function convertTemp(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}
