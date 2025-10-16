import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface DogInfo {
  name: string;
  breed: string;
  age: number;
  lastWalk?: string;
}

// Mock data
const mockWeather: WeatherInfo = {
  temperature: 22,
  condition: 'Sunny',
  humidity: 65,
  windSpeed: 8,
};

const mockDog: DogInfo = {
  name: 'Buddy',
  breed: 'Golden Retriever',
  age: 3,
  lastWalk: '2 hours ago',
};

const walkSuggestions = [
  {
    id: '1',
    title: 'Morning Park Walk',
    duration: '30 min',
    distance: '2.1 km',
    difficulty: 'Easy',
    description: 'Perfect weather for a relaxing walk in the park',
  },
  {
    id: '2',
    title: 'Beach Trail',
    duration: '45 min',
    distance: '3.2 km',
    difficulty: 'Moderate',
    description: 'Great for active dogs who love water',
  },
  {
    id: '3',
    title: 'Neighborhood Loop',
    duration: '20 min',
    distance: '1.5 km',
    difficulty: 'Easy',
    description: 'Quick walk around familiar streets',
  },
];

export default function HomeScreen() {
  const handleStartWalk = () => {
    router.push('/(tabs)/../walk' as any);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      default: return '🌤️';
    }
  };

  const getWalkingRecommendation = (weather: WeatherInfo) => {
    if (weather.temperature > 25) {
      return { text: 'Great weather for walking!', color: 'text-green-600' };
    } else if (weather.temperature < 5) {
      return { text: 'Bundle up for a chilly walk', color: 'text-blue-600' };
    } else {
      return { text: 'Perfect walking conditions', color: 'text-primary' };
    }
  };

  const recommendation = getWalkingRecommendation(mockWeather);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text-primary mb-2">
            Good morning! 🌅
          </Text>
          <Text className="text-text-secondary">
            Ready for an adventure with {mockDog.name}?
          </Text>
        </View>

        {/* Dog Info Card */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: 20 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">🐕</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-text-primary mb-1">
                  {mockDog.name}
                </Text>
                <Text className="text-text-secondary mb-1">
                  {mockDog.breed} • {mockDog.age} years old
                </Text>
                {mockDog.lastWalk && (
                  <Text className="text-sm text-accent">
                    Last walk: {mockDog.lastWalk}
                  </Text>
                )}
              </View>
            </View>
            <Button
               title="Edit"
               variant="outline"
               size="sm"
               onPress={() => router.push('/(tabs)/../dog' as any)}
             />
          </View>
        </Card>

        {/* Weather Card */}
        <Card variant="default" padding="lg" style={{ marginBottom: 20 }}>
          <CardHeader>
            <CardTitle>Today's Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Text className="text-4xl mr-3">
                  {getWeatherIcon(mockWeather.condition)}
                </Text>
                <View>
                  <Text className="text-2xl font-bold text-text-primary">
                    {mockWeather.temperature}°C
                  </Text>
                  <Text className="text-text-secondary">
                    {mockWeather.condition}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className={`font-medium ${recommendation.color}`}>
                  {recommendation.text}
                </Text>
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-text-secondary text-sm">Humidity</Text>
                <Text className="text-text-primary font-medium">{mockWeather.humidity}%</Text>
              </View>
              <View className="items-center">
                <Text className="text-text-secondary text-sm">Wind</Text>
                <Text className="text-text-primary font-medium">{mockWeather.windSpeed} km/h</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Quick Start Walk Button */}
        <Button
          title="🚶‍♂️ Start Walking Now"
          onPress={handleStartWalk}
          variant="primary"
          size="lg"
          style={{ marginBottom: 24 }}
        />

        {/* Walk Suggestions */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-text-primary mb-4">
            Suggested Walks
          </Text>
          
          {walkSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              onPress={handleStartWalk}
            >
              <Card variant="default" padding="md" style={{ marginBottom: 12 }}>
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-lg font-semibold text-text-primary flex-1">
                    {suggestion.title}
                  </Text>
                  <View className="bg-secondary/20 px-2 py-1 rounded-full">
                    <Text className="text-secondary text-xs font-medium">
                      {suggestion.difficulty}
                    </Text>
                  </View>
                </View>
                
                <Text className="text-text-secondary text-sm mb-3">
                  {suggestion.description}
                </Text>
                
                <View className="flex-row justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-text-secondary text-sm mr-4">
                      ⏱️ {suggestion.duration}
                    </Text>
                    <Text className="text-text-secondary text-sm">
                      📍 {suggestion.distance}
                    </Text>
                  </View>
                  <Text className="text-primary font-medium">Start →</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View className="flex-row space-x-3 mb-6">
          <Card variant="elevated" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">This Week</Text>
            <Text className="text-xl font-bold text-primary">7 walks</Text>
          </Card>
          
          <Card variant="elevated" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Distance</Text>
            <Text className="text-xl font-bold text-secondary">12.3 km</Text>
          </Card>
          
          <Card variant="elevated" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Time</Text>
            <Text className="text-xl font-bold text-accent">4h 20m</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
