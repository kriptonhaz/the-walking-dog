export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed: number;
  windDirection?: number;
  isDay: boolean;
  location?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface OpenMeteoCurrentWeather {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

interface OpenMeteoCurrentWeatherUnits {
  time: string;
  interval: string;
  temperature: string;
  windspeed: string;
  winddirection: string;
  is_day: string;
  weathercode: string;
}

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: OpenMeteoCurrentWeatherUnits;
  current_weather: OpenMeteoCurrentWeather;
}

export class WeatherService {
  private static readonly OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

  // Weather code descriptions based on WMO codes
  private static readonly weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  } as const;

  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherInfo> {
    try {
      const url = `${this.OPEN_METEO_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenMeteoResponse = await response.json();
      const currentWeather = data.current_weather;

      return {
        temperature: Math.round(currentWeather.temperature),
        condition: this.weatherDescriptions[currentWeather.weathercode as keyof typeof this.weatherDescriptions] || 'Unknown',
        windSpeed: Math.round(currentWeather.windspeed),
        windDirection: currentWeather.winddirection,
        isDay: currentWeather.is_day === 1,
      };
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  static getMockWeather(): WeatherInfo {
    return {
      temperature: 22,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 8,
      isDay: true,
      location: 'Current Location',
    };
  }

  static getWeatherIcon(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return '☀️';
      case 'cloudy':
      case 'clouds':
        return '☁️';
      case 'rainy':
      case 'rain':
        return '🌧️';
      case 'snowy':
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
      case 'drizzle':
        return '🌦️';
      case 'mist':
      case 'fog':
        return '🌫️';
      default:
        return '🌤️';
    }
  }

  static getWalkingRecommendation(weather: WeatherInfo): { text: string; color: string } {
    const temp = weather.temperature;
    
    if (temp > 30) {
      return { text: 'Too hot! Walk early morning or evening', color: 'text-red-600' };
    } else if (temp > 25) {
      return { text: 'Great weather for walking!', color: 'text-green-600' };
    } else if (temp > 15) {
      return { text: 'Perfect walking conditions', color: 'text-green-500' };
    } else if (temp > 5) {
      return { text: 'Cool weather - perfect for active dogs', color: 'text-blue-500' };
    } else if (temp > 0) {
      return { text: 'Bundle up for a chilly walk', color: 'text-blue-600' };
    } else {
      return { text: 'Very cold - keep walks short', color: 'text-blue-800' };
    }
  }
}