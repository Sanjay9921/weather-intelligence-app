import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  Activity,
  Compass,
  Utensils,
  Mountain,
  Camera,
  Landmark,
  Car,
  Shirt,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const iconProps = { className, size };

  switch (name) {
    case 'Sun':
      return <Sun {...iconProps} />;
    case 'Moon':
      return <Moon {...iconProps} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} />;
    case 'Cloud':
      return <Cloud {...iconProps} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} />;
    case 'CloudRain':
    case 'CloudHail':
      return <CloudRain {...iconProps} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} />;
    case 'Activity':
      return <Activity {...iconProps} />;
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'Utensils':
      return <Utensils {...iconProps} />;
    case 'Mountain':
      return <Mountain {...iconProps} />;
    case 'Camera':
      return <Camera {...iconProps} />;
    case 'Landmark':
      return <Landmark {...iconProps} />;
    case 'Car':
      return <Car {...iconProps} />;
    case 'Shirt':
      return <Shirt {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
};
