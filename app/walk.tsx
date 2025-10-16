import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

interface WalkStats {
  duration: number; // in seconds
  distance: number; // in meters
  steps: number;
  calories: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

export default function WalkScreen() {
  const [isWalking, setIsWalking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [walkStats, setWalkStats] = useState<WalkStats>({
    duration: 0,
    distance: 0,
    steps: 0,
    calories: 0,
  });
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  // Mock location for demo
  useEffect(() => {
    setCurrentLocation({
      latitude: 37.7749,
      longitude: -122.4194,
    });
  }, []);

  // Timer effect for walk duration
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isWalking && !isPaused) {
      interval = setInterval(() => {
        setWalkStats(prev => ({
          ...prev,
          duration: prev.duration + 1,
          // Mock incremental updates
          distance: prev.distance + Math.random() * 2,
          steps: prev.steps + Math.floor(Math.random() * 3),
          calories: prev.calories + 0.1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isWalking, isPaused]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const handleStartWalk = () => {
    setIsWalking(true);
    setIsPaused(false);
  };

  const handlePauseWalk = () => {
    setIsPaused(!isPaused);
  };

  const handleStopWalk = () => {
    Alert.alert(
      'End Walk',
      'Are you sure you want to end this walk?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Walk',
          style: 'destructive',
          onPress: () => {
            setIsWalking(false);
            setIsPaused(false);
            // Here you would typically save the walk data
            router.back();
          },
        },
      ]
    );
  };

  const getWalkStatus = () => {
    if (!isWalking) return 'Ready to start';
    if (isPaused) return 'Paused';
    return 'Walking...';
  };

  const getStatusColor = () => {
    if (!isWalking) return 'text-text-secondary';
    if (isPaused) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-text-primary mb-1">
              Dog Walk
            </Text>
            <Text className={`text-lg font-medium ${getStatusColor()}`}>
              {getWalkStatus()}
            </Text>
          </View>
          <Button
            title="Close"
            variant="outline"
            size="sm"
            onPress={() => router.back()}
          />
        </View>

        {/* Map Placeholder */}
        <Card variant="elevated" padding="none" style={{ marginBottom: 24 }}>
          <View className="h-64 bg-gray-200 rounded-lg items-center justify-center">
            <Text className="text-4xl mb-2">🗺️</Text>
            <Text className="text-text-secondary text-center">
              Map View
            </Text>
            <Text className="text-text-secondary text-center text-sm mt-1">
              {currentLocation 
                ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
                : 'Getting location...'
              }
            </Text>
          </View>
        </Card>

        {/* Walk Stats */}
        <View className="flex-row space-x-3 mb-6">
          <Card variant="default" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Duration</Text>
            <Text className="text-2xl font-bold text-primary">
              {formatDuration(walkStats.duration)}
            </Text>
          </Card>
          
          <Card variant="default" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Distance</Text>
            <Text className="text-2xl font-bold text-secondary">
              {formatDistance(walkStats.distance)}
            </Text>
          </Card>
        </View>

        <View className="flex-row space-x-3 mb-8">
          <Card variant="default" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Steps</Text>
            <Text className="text-xl font-bold text-accent">
              {walkStats.steps.toLocaleString()}
            </Text>
          </Card>
          
          <Card variant="default" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Calories</Text>
            <Text className="text-xl font-bold text-orange-600">
              {Math.round(walkStats.calories)}
            </Text>
          </Card>
        </View>

        {/* Control Buttons */}
        <View className="space-y-4">
          {!isWalking ? (
            <Button
              title="🚶‍♂️ Start Walk"
              onPress={handleStartWalk}
              variant="primary"
              size="lg"
            />
          ) : (
            <View className="space-y-3">
              <Button
                title={isPaused ? "▶️ Resume" : "⏸️ Pause"}
                onPress={handlePauseWalk}
                variant={isPaused ? "primary" : "secondary"}
                size="lg"
              />
              <Button
                title="🛑 End Walk"
                onPress={handleStopWalk}
                variant="destructive"
                size="lg"
              />
            </View>
          )}
        </View>

        {/* Walk Tips */}
        {!isWalking && (
          <Card variant="default" padding="lg" style={{ marginTop: 24 }}>
            <CardHeader>
              <CardTitle>Walking Tips 💡</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-2">
                <Text className="text-text-secondary">
                  • Keep your dog hydrated, especially on warm days
                </Text>
                <Text className="text-text-secondary">
                  • Let your dog sniff and explore - it's mental stimulation
                </Text>
                <Text className="text-text-secondary">
                  • Watch for signs of fatigue or overheating
                </Text>
                <Text className="text-text-secondary">
                  • Bring waste bags and clean up after your dog
                </Text>
              </View>
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}