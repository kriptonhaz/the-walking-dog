import { weatherApi } from './api';

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

export class WeatherService {
  private static readonly API_KEY = 'demo'; // Replace with actual API key in production

  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherInfo> {
    try {
      const response = await weatherApi.get('weather', {
        searchParams: {
          lat: latitude.toString(),
          lon: longitude.toString(),
          appid: this.API_KEY,
          units: 'metric',
        },
      });

      const data: OpenWeatherResponse = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        location: `${data.name}, ${data.sys.country}`,
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