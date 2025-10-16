import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { useDogStore } from '@/store/dogStore';
import { useWeather } from '@/hooks/use-weather';
import { WeatherService } from '@/services/weather-api';

const { width, height } = Dimensions.get("window");

interface DogInfo {
  name: string;
  breed: string;
  age: number;
  lastWalk?: string;
}

// Mock data
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
  const { dogs } = useDogStore();
  const { weather, isLoading: isLoadingWeather, refetch } = useWeather();

  const handleStartWalk = () => {
    router.push('/(tabs)/../walk' as any);
  };

  const currentWeather = weather || WeatherService.getMockWeather();
  const recommendation = WeatherService.getWalkingRecommendation(currentWeather);

  return (
    <View className="flex-1 bg-background">
      {/* Background Animation */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <LottieView
          source={require("@/assets/animations/moving-grass.json")}
          autoPlay
          loop
          style={{
            width: width,
            height: height,
            opacity: 0.6,
          }}
          resizeMode="cover"
        />
      </View>

      <SafeAreaView className="flex-1" style={{ zIndex: 1 }}>
        <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-8 mt-4">
            <Text className="text-3xl font-bold text-text-primary mb-2">
              Good morning! 🌅
            </Text>
            <Text className="text-lg text-text-secondary">
              Ready for an adventure with your furry friend?
            </Text>
          </View>

          {/* Weather Card - Redesigned */}
          <Card variant="elevated" padding="lg" style={{ marginBottom: 24 }}>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-lg font-semibold text-text-primary mb-1">
                  Today's Weather
                </Text>
                {currentWeather.location && (
                  <Text className="text-sm text-text-secondary">
                    📍 {currentWeather.location}
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                onPress={refetch}
                className="bg-primary/10 p-3 rounded-full"
                disabled={isLoadingWeather}
              >
                <Text className={`text-lg ${isLoadingWeather ? 'opacity-50' : ''}`}>
                  🔄
                </Text>
              </TouchableOpacity>
            </View>

            {isLoadingWeather ? (
              <View className="items-center py-8">
                <Text className="text-4xl mb-3">🌤️</Text>
                <Text className="text-text-secondary">Getting weather data...</Text>
              </View>
            ) : (
              <>
                <View className="flex-row items-center mb-6">
                  <View className="bg-primary/10 p-4 rounded-2xl mr-4">
                    <Text className="text-5xl">
                      {WeatherService.getWeatherIcon(currentWeather.condition)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-4xl font-bold text-text-primary mb-1">
                      {currentWeather.temperature}°C
                    </Text>
                    <Text className="text-lg text-text-secondary mb-2">
                      {currentWeather.condition}
                    </Text>
                    <View className="bg-green-100 px-3 py-1 rounded-full self-start">
                      <Text className={`text-sm font-medium ${recommendation.color}`}>
                        {recommendation.text}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row justify-around bg-background/50 rounded-xl p-4">
                  <View className="items-center">
                    <Text className="text-2xl mb-1">💧</Text>
                    <Text className="text-text-secondary text-sm">Humidity</Text>
                    <Text className="text-text-primary font-semibold">{currentWeather.humidity}%</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl mb-1">💨</Text>
                    <Text className="text-text-secondary text-sm">Wind</Text>
                    <Text className="text-text-primary font-semibold">{currentWeather.windSpeed} km/h</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl mb-1">🌡️</Text>
                    <Text className="text-text-secondary text-sm">Feels like</Text>
                    <Text className="text-text-primary font-semibold">{currentWeather.temperature + 2}°C</Text>
                  </View>
                </View>
              </>
            )}
          </Card>

          {/* Dogs Section - Redesigned */}
          {dogs.length > 0 ? (
            <View className="mb-6">
              <Text className="text-xl font-bold text-text-primary mb-4">
                Your Dogs 🐕
              </Text>
              {dogs.map((dog) => (
                <Card key={dog.id} variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
                  <View className="flex-row items-center">
                    <View className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl items-center justify-center mr-4 overflow-hidden">
                      {dog.photo ? (
                        <Image 
                          source={{ uri: dog.photo }} 
                          style={{ width: 80, height: 80, borderRadius: 16 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text className="text-3xl">🐕</Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-text-primary mb-1">
                        {dog.name}
                      </Text>
                      <Text className="text-text-secondary mb-2">
                        {dog.breed} • {dog.age} years old
                      </Text>
                      <View className="flex-row items-center">
                        <View className="bg-accent/20 px-2 py-1 rounded-full mr-2">
                          <Text className="text-accent text-xs font-medium">
                            {dog.weight} kg
                          </Text>
                        </View>
                        <Text className="text-sm text-green-600">
                          Ready for walk! 🚶‍♂️
                        </Text>
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
              ))}
            </View>
          ) : (
            <Card variant="elevated" padding="lg" style={{ marginBottom: 24 }}>
              <View className="items-center py-6">
                <View className="bg-primary/10 p-6 rounded-full mb-4">
                  <Text className="text-6xl">🐕</Text>
                </View>
                <Text className="text-xl font-bold text-text-primary mb-2">
                  No Dogs Registered
                </Text>
                <Text className="text-text-secondary text-center mb-6 leading-6">
                  Add your first furry friend to get started with tracking walks and personalized recommendations!
                </Text>
                <Button
                  title="Add Your First Dog"
                  variant="primary"
                  onPress={() => router.push('/(tabs)/../dog' as any)}
                />
              </View>
            </Card>
          )}

          {/* Quick Start Walk Button - Redesigned */}
          <TouchableOpacity
            onPress={handleStartWalk}
            className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-6 shadow-lg"
            style={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-2xl mr-3">🚶‍♂️</Text>
              <Text className="text-white text-xl font-bold">Start Walking Now</Text>
            </View>
            <Text className="text-white/80 text-center mt-2">
              Perfect conditions for a great walk!
            </Text>
          </TouchableOpacity>

          {/* Walk Suggestions - Redesigned */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-text-primary mb-4">
              Suggested Walks ✨
            </Text>
            
            {walkSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={suggestion.id}
                onPress={handleStartWalk}
                className="mb-4"
              >
                <Card variant="default" padding="lg">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-text-primary mb-1">
                        {suggestion.title}
                      </Text>
                      <Text className="text-text-secondary text-sm mb-3 leading-5">
                        {suggestion.description}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ml-3 ${
                      suggestion.difficulty === 'Easy' ? 'bg-green-100' :
                      suggestion.difficulty === 'Moderate' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        suggestion.difficulty === 'Easy' ? 'text-green-700' :
                        suggestion.difficulty === 'Moderate' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {suggestion.difficulty}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row space-x-4">
                      <View className="flex-row items-center">
                        <Text className="text-lg mr-1">⏱️</Text>
                        <Text className="text-text-secondary text-sm font-medium">
                          {suggestion.duration}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-lg mr-1">📍</Text>
                        <Text className="text-text-secondary text-sm font-medium">
                          {suggestion.distance}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-primary/10 px-4 py-2 rounded-full">
                      <Text className="text-primary font-semibold text-sm">Start →</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Stats - Redesigned */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-text-primary mb-4">
              This Week's Progress 📊
            </Text>
            <View className="flex-row space-x-3">
              <Card variant="elevated" padding="lg" style={{ flex: 1 }}>
                <View className="items-center">
                  <Text className="text-3xl mb-2">🚶‍♂️</Text>
                  <Text className="text-2xl font-bold text-primary mb-1">7</Text>
                  <Text className="text-text-secondary text-sm text-center">walks</Text>
                </View>
              </Card>
              
              <Card variant="elevated" padding="lg" style={{ flex: 1 }}>
                <View className="items-center">
                  <Text className="text-3xl mb-2">📍</Text>
                  <Text className="text-2xl font-bold text-secondary mb-1">12.3</Text>
                  <Text className="text-text-secondary text-sm text-center">km</Text>
                </View>
              </Card>
              
              <Card variant="elevated" padding="lg" style={{ flex: 1 }}>
                <View className="items-center">
                  <Text className="text-3xl mb-2">⏰</Text>
                  <Text className="text-2xl font-bold text-accent mb-1">4h 20m</Text>
                  <Text className="text-text-secondary text-sm text-center">time</Text>
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
