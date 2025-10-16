import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

interface WalkEntry {
  id: string;
  date: string;
  duration: number; // in minutes
  distance: number; // in kilometers
  weather: string;
  notes?: string;
}

// Mock data for demonstration
const mockWalkHistory: WalkEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    duration: 45,
    distance: 2.3,
    weather: 'Sunny',
    notes: 'Great walk in the park!'
  },
  {
    id: '2',
    date: '2024-01-14',
    duration: 30,
    distance: 1.8,
    weather: 'Cloudy',
  },
  {
    id: '3',
    date: '2024-01-13',
    duration: 60,
    distance: 3.1,
    weather: 'Light Rain',
    notes: 'Short walk due to weather'
  },
];

export default function JournalScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderWalkEntry = ({ item }: { item: WalkEntry }) => (
    <Card variant="default" padding="md" style={{ marginBottom: 12 }}>
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-text-primary">
          {new Date(item.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
        <View className="bg-primary/10 px-2 py-1 rounded-full">
          <Text className="text-primary text-xs font-medium">{item.weather}</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mb-3">
        <View className="flex-1">
          <Text className="text-text-secondary text-sm">Duration</Text>
          <Text className="text-text-primary font-medium">{formatDuration(item.duration)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-text-secondary text-sm">Distance</Text>
          <Text className="text-text-primary font-medium">{item.distance} km</Text>
        </View>
        <View className="flex-1">
          <Text className="text-text-secondary text-sm">Pace</Text>
          <Text className="text-text-primary font-medium">
            {(item.duration / item.distance).toFixed(1)} min/km
          </Text>
        </View>
      </View>
      
      {item.notes && (
        <View className="border-t border-neutral-200 pt-2">
          <Text className="text-text-secondary text-sm italic">{item.notes}</Text>
        </View>
      )}
    </Card>
  );

  const totalWalks = mockWalkHistory.length;
  const totalDistance = mockWalkHistory.reduce((sum, walk) => sum + walk.distance, 0);
  const totalDuration = mockWalkHistory.reduce((sum, walk) => sum + walk.duration, 0);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text-primary mb-2">
            Walking Journal
          </Text>
          <Text className="text-text-secondary">
            Track your walking adventures with your furry friend
          </Text>
        </View>

        {/* Statistics Cards */}
        <View className="flex-row mb-6 space-x-3">
          <Card variant="elevated" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Total Walks</Text>
            <Text className="text-2xl font-bold text-primary">{totalWalks}</Text>
          </Card>
          
          <Card variant="elevated" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Distance</Text>
            <Text className="text-2xl font-bold text-secondary">{totalDistance.toFixed(1)} km</Text>
          </Card>
          
          <Card variant="elevated" padding="md" style={{ flex: 1 }}>
            <Text className="text-text-secondary text-sm mb-1">Time</Text>
            <Text className="text-2xl font-bold text-accent">{formatDuration(totalDuration)}</Text>
          </Card>
        </View>

        {/* Calendar Section */}
        <Card variant="default" padding="lg" style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="items-center py-8">
              <Text className="text-text-secondary text-center mb-4">
                📅 Calendar integration coming soon!
              </Text>
              <Text className="text-text-secondary text-center text-sm">
                View your walking schedule and plan future walks
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Walking History */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-text-primary">
              Recent Walks
            </Text>
            <Button
              title="View All"
              variant="ghost"
              size="sm"
              onPress={() => {/* TODO: Navigate to full history */}}
            />
          </View>
          
          <FlatList
            data={mockWalkHistory}
            renderItem={renderWalkEntry}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Empty State for no walks */}
        {mockWalkHistory.length === 0 && (
          <Card variant="default" padding="lg">
            <View className="items-center py-8">
              <Text className="text-6xl mb-4">🐕</Text>
              <Text className="text-lg font-semibold text-text-primary mb-2">
                No walks yet!
              </Text>
              <Text className="text-text-secondary text-center mb-4">
                Start your first walk to see it appear in your journal
              </Text>
              <Button
                title="Start Walking"
                variant="primary"
                onPress={() => {/* TODO: Navigate to walk screen */}}
              />
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}