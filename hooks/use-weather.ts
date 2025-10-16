import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { WeatherService, WeatherInfo, LocationData } from '@/services/weather-api';

interface UseWeatherOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseWeatherReturn {
  weather: WeatherInfo | null;
  location: LocationData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  requestLocationAndWeather: () => Promise<void>;
}

export const useWeather = (options: UseWeatherOptions = {}): UseWeatherReturn => {
  const { enabled = true, refetchInterval } = options;
  const queryClient = useQueryClient();

  // Location query
  const {
    data: location,
    isLoading: isLocationLoading,
    error: locationError,
  } = useQuery({
    queryKey: ['location'],
    queryFn: async (): Promise<LocationData> => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;
      
      // Reverse geocoding to get city name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      return {
        latitude,
        longitude,
        city: reverseGeocode[0]?.city || 'Unknown',
        country: reverseGeocode[0]?.country || 'Unknown',
      };
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });

  // Weather query - depends on location
  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: async (): Promise<WeatherInfo> => {
      if (!location) {
        throw new Error('Location not available');
      }

      try {
        const weatherData = await WeatherService.getCurrentWeather(
          location.latitude,
          location.longitude
        );
        
        return {
          ...weatherData,
          location: `${location.city}, ${location.country}`,
        };
      } catch (error) {
        console.warn('Weather API failed, using mock data:', error);
        // Fallback to mock data if API fails
        return {
          ...WeatherService.getMockWeather(),
          location: `${location.city}, ${location.country}`,
        };
      }
    },
    enabled: enabled && !!location,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchInterval,
  });

  // Mutation for manual location and weather refresh
  const locationWeatherMutation = useMutation({
    mutationFn: async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to get weather information for your walks.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        throw new Error('Location permission denied');
      }

      // Invalidate and refetch both location and weather
      await queryClient.invalidateQueries({ queryKey: ['location'] });
      await queryClient.invalidateQueries({ queryKey: ['weather'] });
    },
    onError: (error) => {
      console.error('Failed to refresh location and weather:', error);
    },
  });

  const isLoading = isLocationLoading || isWeatherLoading || locationWeatherMutation.isPending;
  const error = locationError || weatherError || locationWeatherMutation.error;

  const refetch = () => {
    refetchWeather();
    queryClient.invalidateQueries({ queryKey: ['location'] });
  };

  const requestLocationAndWeather = async () => {
    await locationWeatherMutation.mutateAsync();
  };

  return {
    weather: weather || null,
    location: location || null,
    isLoading,
    isError: !!error,
    error: error as Error | null,
    refetch,
    requestLocationAndWeather,
  };
};