import { Button, Card, CardContent } from "@/components/ui";
import { DesignSystemColors } from "@/constants/theme";
import { useDogStore } from "@/store/dogStore";
import { useWalkStore, WalkEntry } from "@/store/walkStore";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function JournalScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { width, height } = Dimensions.get("window");

  // Get data from stores
  const { walks } = useWalkStore();
  const { dogs } = useDogStore();

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDistance = (meters: number): string => {
    const km = meters / 1000;
    return `${km.toFixed(2)} km`;
  };

  const getWalksForDate = (date: string): WalkEntry[] => {
    return walks.filter((walk) => walk.date.split("T")[0] === date);
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    walks.forEach((walk) => {
      const walkDate = walk.date.split("T")[0];
      marked[walkDate] = {
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

  const getDogById = (dogId: string) => {
    return dogs.find((dog) => dog.id === dogId);
  };

  const renderWalkEntry = ({ item }: { item: WalkEntry }) => {
    const dog = getDogById(item.dogId);
    const walkTime = new Date(item.time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.walkCard}>
        {/* Colored stripe on the left */}
        <View style={styles.colorStripe} />
        
        <View style={styles.walkCardContent}>
          {/* Left Section - Dog Info */}
          <View style={styles.dogInfoSection}>
            <View style={styles.dogAvatarContainer}>
              {dog?.photo ? (
                <Image
                  source={{ uri: dog.photo }}
                  style={styles.dogAvatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.dogAvatarPlaceholder}>
                  <Text style={styles.dogAvatarText}>🐕</Text>
                </View>
              )}
            </View>
            <Text style={styles.dogName}>{dog?.name || "Unknown Dog"}</Text>
            <Text style={styles.dogBreed}>{dog?.breed || ""}</Text>
          </View>

          {/* Right Section - Walk Stats */}
          <View style={styles.walkStatsSection}>
            <Text style={styles.walkStatsTitle}>Walk Details</Text>
            <View style={styles.walkStatsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Time</Text>
                <Text style={styles.statValue}>{walkTime}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>
                  {formatDuration(item.duration)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>
                  {formatDistance(item.distance)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const selectedDateWalks = getWalksForDate(selectedDate);
  const totalWalks = walks.length;
  const totalDistance = walks.reduce((sum, walk) => sum + walk.distance, 0);
  const totalDuration = walks.reduce((sum, walk) => sum + walk.duration, 0);

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
        <View className="flex-1 px-6 py-8">
          {/* Calendar Section */}
          <Card
            variant="default"
            padding="lg"
            style={{
              marginBottom: 24,
              width: 0.9 * width,
              alignSelf: "center",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
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
            <FlatList
              data={selectedDateWalks}
              renderItem={renderWalkEntry}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

          {/* No walks for selected date */}
          {selectedDateWalks.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <LottieView
                source={require("../../assets/animations/dog-walking-3.json")}
                autoPlay
                loop
                style={styles.emptyStateAnimation}
              />
              <Text style={styles.emptyStateText}>No Data This Day</Text>
            </View>
          )}

          {/* Empty State for no walks at all */}
          {walks.length === 0 && (
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
        </View>
      </SafeAreaView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  walkCard: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 0,
    marginBottom: 16,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    flexDirection: "row",
    overflow: "hidden",
  },
  colorStripe: {
    width: 6,
    backgroundColor: "#10B981",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  walkCardContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "stretch",
    padding: 20,
  },
  dogInfoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 12,
  },
  dogAvatarContainer: {
    marginBottom: 12,
  },
  dogAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  dogAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  dogAvatarText: {
    fontSize: 24,
  },
  dogName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 2,
    textAlign: "center",
  },
  dogBreed: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  walkStatsSection: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  walkStatsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },
  walkStatsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  statItem: {
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
    textAlign: "center",
  },
  emptyStateContainer: {
    // flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
});
