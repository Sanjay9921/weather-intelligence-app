import { CurrentWeather, DailyWeather, ActivityRecommendation } from '../types/weather';

export function generateRecommendations(
  current: CurrentWeather,
  daily?: DailyWeather
): ActivityRecommendation[] {
  const temp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const code = current.weather_code;
  const rain = current.precipitation;
  const wind = current.wind_speed_10m; // km/h
  const humidity = current.relative_humidity_2m;
  const isDay = current.is_day;

  const isRaining = rain > 0.2 || (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isStorming = code >= 95;
  const isSnowing = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
  const isFreezing = temp <= 2;
  const isScorching = apparentTemp >= 35;
  const isVeryWindy = wind >= 38; // > 38 km/h is strong breeze
  const isGentleWind = wind <= 20;

  const recommendations: ActivityRecommendation[] = [];

  // 1. Outdoor Running & Fitness
  {
    let status: 'optimal' | 'good' | 'caution' | 'avoid' = 'good';
    let score = 75;
    let reason = '';
    let tip = '';

    if (isStorming || isRaining || isSnowing) {
      status = 'avoid';
      score = 20;
      reason = isStorming
        ? 'Dangerous lightning and severe gusts expected outdoors.'
        : 'Slick roads and active precipitation increase slipping risk.';
      tip = 'Opt for an indoor treadmill workout or gym session today.';
    } else if (isScorching) {
      status = 'caution';
      score = 45;
      reason = `Excessive heat index (${Math.round(apparentTemp)}°C) increases rapid dehydration and heat exhaustion risk.`;
      tip = 'If running, do so strictly before 7:00 AM or after sunset; hydrate thoroughly.';
    } else if (isFreezing) {
      status = 'caution';
      score = 50;
      reason = 'Freezing temperatures and potential ice patches on pavement.';
      tip = 'Wear thermal compression gear and shoes with high grip.';
    } else if (temp >= 14 && temp <= 22 && isGentleWind) {
      status = 'optimal';
      score = 98;
      reason = `Mild temperatures (${Math.round(temp)}°C) and gentle air velocity make running conditions peak.`;
      tip = 'Excellent window for endurance mileage or interval training.';
    } else {
      status = 'good';
      score = 80;
      reason = `Manageable ${Math.round(temp)}°C conditions with ${Math.round(wind)} km/h wind.`;
      tip = 'Light dynamic stretching and standard athletic layers recommended.';
    }

    recommendations.push({
      id: 'running',
      category: 'Fitness & Athletics',
      title: 'Running & Cycling',
      status,
      score,
      reason,
      tip,
      icon: 'Activity',
    });
  }

  // 2. Sightseeing & Walking Tours
  {
    let status: 'optimal' | 'good' | 'caution' | 'avoid' = 'good';
    let score = 80;
    let reason = '';
    let tip = '';

    if (isStorming || rain > 4) {
      status = 'avoid';
      score = 15;
      reason = 'Active heavy downpour or storms render long walks uncomfortable.';
      tip = 'Pivot to covered arcades, indoor markets, or historic galleries.';
    } else if (isRaining) {
      status = 'caution';
      score = 45;
      reason = 'Intermittent drizzle or light rain dampens pedestrian paths.';
      tip = 'Carry a compact windproof umbrella and waterproof footwear.';
    } else if (isScorching) {
      status = 'caution';
      score = 55;
      reason = `High thermal load (${Math.round(apparentTemp)}°C) makes midday sun exposure intense.`;
      tip = 'Plan walking stops through tree-lined streets or air-conditioned pavilions.';
    } else if ((code === 0 || code === 1 || code === 2) && temp >= 16 && temp <= 26) {
      status = 'optimal';
      score = 95;
      reason = 'Clear skies with pleasant ambient warmth provide scenic, comfortable strolling.';
      tip = 'Ideal day for architectural tours, open plazas, and parks.';
    } else {
      status = 'good';
      score = 75;
      reason = `Fair outdoor visibility with ${Math.round(temp)}°C ambient air.`;
      tip = 'Dress in flexible breathable layers for changing pace.';
    }

    recommendations.push({
      id: 'sightseeing',
      category: 'Urban & Leisure',
      title: 'City Exploration & Walking',
      status,
      score,
      reason,
      tip,
      icon: 'Compass',
    });
  }

  // 3. Outdoor Dining & Rooftops
  {
    let status: 'optimal' | 'good' | 'caution' | 'avoid' = 'good';
    let score = 70;
    let reason = '';
    let tip = '';

    if (isRaining || isStorming || isSnowing || isVeryWindy) {
      status = 'avoid';
      score = 20;
      reason = isVeryWindy
        ? `Wind gusts (${Math.round(wind)} km/h) disrupt rooftop dining and open patios.`
        : 'Precipitation prevents outdoor patio seating.';
      tip = 'Reserve an intimate glass-walled indoor bistro or dining room instead.';
    } else if (temp < 13) {
      status = 'caution';
      score = 50;
      reason = `Brisk chill (${Math.round(temp)}°C) makes unheated terrace seating cold.`;
      tip = 'Look for cafes equipped with patio heaters and cozy blankets.';
    } else if (apparentTemp > 33) {
      status = 'caution';
      score = 48;
      reason = 'Direct radiant heat creates an uncomfortable patio experience at peak hours.';
      tip = 'Choose shaded, mist-cooled courtyards or wait until twilight.';
    } else if (temp >= 19 && temp <= 27 && wind < 18) {
      status = 'optimal';
      score = 96;
      reason = `Balmy ${Math.round(temp)}°C atmosphere with gentle breeze: quintessential patio weather.`;
      tip = 'Reserve open-air terraces or rooftop lounges early.';
    } else {
      status = 'good';
      score = 78;
      reason = 'Favorable conditions with calm ambient air.';
      tip = 'A light outer cardigan will keep evening breezy drops comfortable.';
    }

    recommendations.push({
      id: 'dining',
      category: 'Culinary & Social',
      title: 'Outdoor Dining & Rooftops',
      status,
      score,
      reason,
      tip,
      icon: 'Utensils',
    });
  }

  // 4. Hiking & Nature Excursions
  {
    let status: 'optimal' | 'good' | 'caution' | 'avoid' = 'good';
    let score = 70;
    let reason = '';
    let tip = '';

    if (isStorming || code >= 80 || rain > 3) {
      status = 'avoid';
      score = 10;
      reason = 'Severe trail erosion, flash mud, and hazardously slippery rock faces.';
      tip = 'Postpone back-country trail ventures until terrain dries thoroughly.';
    } else if (isVeryWindy) {
      status = 'caution';
      score = 40;
      reason = `Exposed mountain ridges suffer strong cross-winds (${Math.round(wind)} km/h).`;
      tip = 'Stick to lower-elevation sheltered forest trails.';
    } else if (temp > 32) {
      status = 'caution';
      score = 45;
      reason = 'Dehydration risk escalates rapidly on strenuous inclines under high sun.';
      tip = 'Pack minimum 2.5L electrolyte water and start at dawn.';
    } else if (code <= 2 && temp >= 12 && temp <= 24 && wind < 25) {
      status = 'optimal';
      score = 94;
      reason = 'Crisp visibility, dry ground, and mild temperatures guarantee summit clarity.';
      tip = 'Pack camera gear and standard trail snacks for scenic overlooks.';
    } else {
      status = 'good';
      score = 76;
      reason = `Stable atmospheric conditions (${Math.round(temp)}°C) suitable for standard trails.`;
      tip = 'Wear lugged hiking shoes and pack an emergency shell.';
    }

    recommendations.push({
      id: 'hiking',
      category: 'Adventure & Nature',
      title: 'Hiking & Mountain Trails',
      status,
      score,
      reason,
      tip,
      icon: 'Mountain',
    });
  }

  // 5. Photography & Drone Flights
  {
    let status: 'optimal' | 'good' | 'caution' | 'avoid' = 'good';
    let score = 75;
    let reason = '';
    let tip = '';

    if (wind > 32) {
      status = 'avoid';
      score = 25;
      reason = `Wind gusts (${Math.round(wind)} km/h) exceed safe drone payload stability limits.`;
      tip = 'Ground aerial drones; use ground-based tripods with ballast.';
    } else if (isRaining || isStorming) {
      status = 'caution';
      score = 40;
      reason = 'Moisture threatens non-weatherproof lenses and aerial electronics.';
      tip = 'Stunning dramatic puddle reflections possible from dry covered lookouts.';
    } else if (code <= 2 && wind < 18) {
      status = 'optimal';
      score = 92;
      reason = 'Crystal-clear sky clarity with soft light gradients and rock-steady air.';
      tip = 'Golden hour around dawn and dusk will deliver exceptional dynamic range.';
    } else {
      status = 'good';
      score = 78;
      reason = 'Even diffused lighting across overcast cloud layers, perfect for soft portraits.';
      tip = 'Polarizing filters can eliminate surface glare nicely today.';
    }

    recommendations.push({
      id: 'photography',
      category: 'Creative Arts',
      title: 'Landscape & Drone Photo',
      status,
      score,
      reason,
      tip,
      icon: 'Camera',
    });
  }

  // 6. Indoor Cultural & Leisure
  {
    let status: 'optimal' | 'good' | 'caution' | 'avoid' = 'good';
    let score = 65;
    let reason = '';
    let tip = '';

    if (isRaining || isStorming || isScorching || isFreezing || isVeryWindy) {
      status = 'optimal';
      score = 96;
      reason = 'Inclement outdoor elements make indoor climate-controlled spaces delightful.';
      tip = 'Explore art museums, state libraries, indie cinemas, or artisan roasteries.';
    } else if (code <= 1 && temp >= 18 && temp <= 26) {
      status = 'good';
      score = 65;
      reason = 'Outdoor conditions are glorious, but museums offer uncrowded quiet.';
      tip = 'Combine a brief gallery stop with an outdoor stroll afterwards.';
    } else {
      status = 'good';
      score = 75;
      reason = 'Reliable comfortable retreat unaffected by outdoor fluctuations.';
      tip = 'Check exhibition reservations or workshop schedules ahead.';
    }

    recommendations.push({
      id: 'indoor',
      category: 'Culture & Entertainment',
      title: 'Museums & Indoor Cultural',
      status,
      score,
      reason,
      tip,
      icon: 'Landmark',
    });
  }

  // 7. Commute & Transit Advisory
  {
    let status: 'optimal' | 'good' | 'caution' | 'avoid' = 'good';
    let score = 85;
    let reason = '';
    let tip = '';

    if (isStorming || code >= 65 || isSnowing || (code >= 45 && code <= 48)) {
      status = 'caution';
      score = 35;
      reason = code >= 45 && code <= 48
        ? 'Dense fog restricts roadway sightlines significantly.'
        : 'Precipitation slows roadway flow and increases braking distance.';
      tip = 'Allow extra buffer time for transit delays and keep headlights illuminated.';
    } else if (isVeryWindy) {
      status = 'caution';
      score = 55;
      reason = 'High-sided vehicles on open bridges face strong lateral wind pressure.';
      tip = 'Maintain steady two-handed grip and safe trailing distances.';
    } else {
      status = 'optimal';
      score = 95;
      reason = 'Dry pavements, unrestricted visibility, and nominal transit conditions.';
      tip = 'Standard regular commuting schedules apply without weather delays.';
    }

    recommendations.push({
      id: 'commute',
      category: 'Travel & Mobility',
      title: 'Commute & Travel Advisory',
      status,
      score,
      reason,
      tip,
      icon: 'Car',
    });
  }

  // 8. Apparel & Gear Recommendation
  {
    let status: 'optimal' | 'good' | 'caution' | 'avoid' = 'good';
    let score = 90;
    let reason = '';
    let tip = '';

    if (temp < 5) {
      reason = `Heavy chill (${Math.round(temp)}°C). Thermal insulation mandatory.`;
      tip = 'Heavy wool coat, thermal base layer, gloves, and insulated beanie.';
    } else if (temp < 14) {
      reason = `Crisp and brisk (${Math.round(temp)}°C). Multiple layers will keep you adaptable.`;
      tip = 'Mid-weight sweater or fleece underneath an autumn windbreaker.';
    } else if (temp < 23) {
      reason = `Pleasant temperature range (${Math.round(temp)}°C). High comfort versatility.`;
      tip = 'Breathable cotton button-down or light jersey with an optional evening layer.';
    } else if (temp < 30) {
      reason = `Warm and bright (${Math.round(temp)}°C). Light fabrics recommended.`;
      tip = 'Linen shirts, UV sunglasses, sun hat, and minimum SPF 30 sunscreen.';
    } else {
      reason = `Intense heat (${Math.round(temp)}°C). Prioritize maximum airflow.`;
      tip = 'Ultra-light moisture-wicking apparel, hydration flask, and polarized shades.';
    }

    if (isRaining || (daily && daily.precipitation_sum[0] > 1)) {
      tip += ' Essential: Pack a waterproof jacket or umbrella.';
    }

    recommendations.push({
      id: 'wardrobe',
      category: 'Attire & Gear',
      title: 'Wardrobe & Daily Gear',
      status: 'good',
      score,
      reason,
      tip,
      icon: 'Shirt',
    });
  }

  return recommendations;
}
