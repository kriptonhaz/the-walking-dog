import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

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
    id: "1",
    date: "2024-01-15",
    duration: 45,
    distance: 2.3,
    weather: "Sunny",
    notes: "Great walk in the park!",
  },
  {
    id: "2",
    date: "2024-01-14",
    duration: 30,
    distance: 1.8,
    weather: "Cloudy",
  },
  {
    id: "3",
    date: "2024-01-13",
    duration: 60,
    distance: 3.1,
    weather: "Light Rain",
    notes: "Short walk due to weather",
  },
];

export default function JournalScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { width, height } = Dimensions.get("window");

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getWalksForDate = (date: string): WalkEntry[] => {
    return mockWalkHistory.filter((walk) => walk.date === date);
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    mockWalkHistory.forEach((walk) => {
      marked[walk.date] = {
        marked: true,
        dotColor: "#10B981",
        activeOpacity: 0.7,
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: "#10B981",
        selectedTextColor: "#ffffff",
      };
    }

    return marked;
  };

  const renderWalkEntry = ({ item }: { item: WalkEntry }) => (
    <Card variant="default" padding="md" style={{ marginBottom: 12 }}>
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-text-primary">
          {new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Text>
        <View className="bg-primary/10 px-2 py-1 rounded-full">
          <Text className="text-primary text-xs font-medium">
            {item.weather}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-3">
        <View className="flex-1">
          <Text className="text-text-secondary text-sm">Duration</Text>
          <Text className="text-text-primary font-medium">
            {formatDuration(item.duration)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-text-secondary text-sm">Distance</Text>
          <Text className="text-text-primary font-medium">
            {item.distance} km
          </Text>
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
          <Text className="text-text-secondary text-sm italic">
            {item.notes}
          </Text>
        </View>
      )}
    </Card>
  );

  const selectedDateWalks = getWalksForDate(selectedDate);
  const totalWalks = mockWalkHistory.length;
  const totalDistance = mockWalkHistory.reduce(
    (sum, walk) => sum + walk.distance,
    0
  );
  const totalDuration = mockWalkHistory.reduce(
    (sum, walk) => sum + walk.duration,
    0
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Background Animation */}
      <LottieView
        source={require("../../assets/animations/moving-grass.json")}
        autoPlay
        loop
        style={{
          position: "absolute",
          width: width,
          height: height,
          zIndex: -1,
        }}
        resizeMode="cover"
      />

      <SafeAreaView className="flex-1 bg-transparent">
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
              <Text className="text-text-secondary text-sm mb-1">
                Total Walks
              </Text>
              <Text className="text-2xl font-bold text-primary">
                {totalWalks}
              </Text>
            </Card>

            <Card variant="elevated" padding="md" style={{ flex: 1 }}>
              <Text className="text-text-secondary text-sm mb-1">Distance</Text>
              <Text className="text-2xl font-bold text-secondary">
                {totalDistance.toFixed(1)} km
              </Text>
            </Card>

            <Card variant="elevated" padding="md" style={{ flex: 1 }}>
              <Text className="text-text-secondary text-sm mb-1">Time</Text>
              <Text className="text-2xl font-bold text-accent">
                {formatDuration(totalDuration)}
              </Text>
            </Card>
          </View>

          {/* Calendar Section */}
          <Card variant="default" padding="lg" style={{ marginBottom: 24 }}>
            <CardHeader>
              <CardTitle>Walk Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                current={selectedDate}
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                }}
                markedDates={getMarkedDates()}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  textSectionTitleColor: "#6B7280",
                  selectedDayBackgroundColor: "#10B981",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#10B981",
                  dayTextColor: "#374151",
                  textDisabledColor: "#D1D5DB",
                  dotColor: "#10B981",
                  selectedDotColor: "#ffffff",
                  arrowColor: "#10B981",
                  monthTextColor: "#374151",
                  indicatorColor: "#10B981",
                  textDayFontFamily: "System",
                  textMonthFontFamily: "System",
                  textDayHeaderFontFamily: "System",
                  textDayFontWeight: "400",
                  textMonthFontWeight: "600",
                  textDayHeaderFontWeight: "500",
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                enableSwipeMonths={true}
                hideExtraDays={true}
                firstDay={1}
              />
            </CardContent>
          </Card>

          {/* Selected Date Walks */}
          {selectedDateWalks.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-text-primary mb-4">
                Walks on{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>

              <FlatList
                data={selectedDateWalks}
                renderItem={renderWalkEntry}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {/* No walks for selected date */}
          {selectedDateWalks.length === 0 && (
            <Card variant="default" padding="lg" style={{ marginBottom: 24 }}>
              <View className="items-center py-6">
                <Text className="text-4xl mb-3">📅</Text>
                <Text className="text-lg font-semibold text-text-primary mb-2">
                  No walks on this date
                </Text>
                <Text className="text-text-secondary text-center">
                  Select a date with a green dot to see walk details
                </Text>
              </View>
            </Card>
          )}

          {/* Empty State for no walks at all */}
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
                  onPress={() => {
                    /* TODO: Navigate to walk screen */
                  }}
                />
              </View>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
