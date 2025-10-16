import { useWeather } from "@/hooks/use-weather";
import { WeatherService } from "@/services/weather-api";
import { useDogStore } from "@/store/dogStore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

// Weather icon mapping function
const getWeatherAnimation = (condition: string, isDay: boolean) => {
  const conditionLower = condition.toLowerCase();

  // Clear sky conditions
  if (conditionLower.includes("clear")) {
    return isDay
      ? require("@/assets/animations/Weather-sunny.json")
      : require("@/assets/animations/Weather-night.json");
  }

  // Mainly clear conditions
  if (conditionLower.includes("mainly clear")) {
    return isDay
      ? require("@/assets/animations/Weather-sunny.json")
      : require("@/assets/animations/Weather-night.json");
  }

  // Partly cloudy conditions
  if (conditionLower.includes("partly cloudy")) {
    return require("@/assets/animations/Weather-partly cloudy.json");
  }

  // Overcast conditions
  if (conditionLower.includes("overcast")) {
    return isDay
      ? require("@/assets/animations/Weather-partly cloudy.json")
      : require("@/assets/animations/Weather-cloudy(night).json");
  }

  // Fog conditions
  if (conditionLower.includes("fog")) {
    return require("@/assets/animations/Weather-foggy.json");
  }

  // Mist conditions
  if (conditionLower.includes("mist")) {
    return require("@/assets/animations/Weather-mist.json");
  }

  // Rain conditions
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    if (conditionLower.includes("shower")) {
      return require("@/assets/animations/Weather-partly shower.json");
    }
    return isDay
      ? require("@/assets/animations/Weather-partly shower.json")
      : require("@/assets/animations/Weather-rainy(night).json");
  }

  // Snow conditions
  if (conditionLower.includes("snow")) {
    if (conditionLower.includes("sunny") || isDay) {
      return require("@/assets/animations/Weather-snow sunny.json");
    }
    return require("@/assets/animations/Weather-snow(night).json");
  }

  // Thunderstorm conditions
  if (conditionLower.includes("thunderstorm")) {
    return conditionLower.includes("hail")
      ? require("@/assets/animations/Weather-storm.json")
      : require("@/assets/animations/Weather-thunder.json");
  }

  // Windy conditions
  if (conditionLower.includes("wind")) {
    return require("@/assets/animations/Weather-windy.json");
  }

  // Default fallback
  return isDay
    ? require("@/assets/animations/Weather-sunny.json")
    : require("@/assets/animations/Weather-night.json");
};

interface DogInfo {
  name: string;
  breed: string;
  age: number;
  lastWalk?: string;
  photo?: string;
}

// Welcome messages that rotate every 5 seconds
const welcomeMessages = [
  "Ready for an adventure? 🌟",
  "Time to explore together! 🚶‍♂️",
  "Your furry friend awaits! 🐕",
  "Let's make today pawsome! 🐾",
  "Adventure is calling! 🌈",
  "Perfect day for a walk! ☀️",
  "Your dog's tail is wagging! 🎾",
  "Nature is waiting for you! 🌳",
];

// Mock data
const mockDog: DogInfo = {
  name: "Buddy",
  breed: "Golden Retriever",
  age: 3,
  lastWalk: "2 hours ago",
};

export default function HomeScreen() {
  const { dogs } = useDogStore();
  const { weather, isLoading: isLoadingWeather, refetch } = useWeather();
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0);

  // Rotate welcome message every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWelcomeIndex(
        (prevIndex) => (prevIndex + 1) % welcomeMessages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartWalk = () => {
    router.push("/(tabs)/../walk" as any);
  };

  useEffect(() => {
    console.log(weather);
  }, [weather]);

  const currentWeather = weather || WeatherService.getMockWeather();
  const currentDog = dogs.length > 0 ? dogs[0] : mockDog;

  // Get current date
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("en-US", options);
  };

  // Calculate daily walk distance needed (based on dog breed and age)
  const getDailyWalkDistance = (breed: string, age: number) => {
    const baseDistance =
      breed.toLowerCase().includes("retriever") ||
      breed.toLowerCase().includes("shepherd")
        ? 5
        : 3;
    const ageMultiplier = age > 7 ? 0.7 : age < 2 ? 0.8 : 1;
    return Math.round(baseDistance * ageMultiplier * 10) / 10;
  };

  const dailyWalkNeeded = getDailyWalkDistance(
    currentDog.breed,
    currentDog.age
  );

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
            // opacity: 0.3,
          }}
          resizeMode="cover"
        />
      </View>

      {/* Weather Card */}
      <View style={styles.container}>
        <LinearGradient
          colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
          style={styles.weatherCard}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.location}>
                {currentWeather.location || "Current Location"}
              </Text>
              <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
          </View>

          {/* Main Weather Info */}
          <View style={styles.mainWeatherInfo}>
            <View style={styles.weatherIconContainer}>
              <LottieView
                source={getWeatherAnimation(
                  currentWeather.condition,
                  currentWeather.isDay ?? true
                )}
                autoPlay
                loop
                style={styles.weatherIcon}
              />
            </View>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>
                {currentWeather.temperature}°
              </Text>
              <Text style={styles.condition}>{currentWeather.condition}</Text>
            </View>
          </View>

          {/* High/Low Temperature */}
          <View style={styles.highLowContainer}>
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>
                High : {currentWeather.temperature + 6}°C
              </Text>
              <Text style={styles.tempArrow}>↗</Text>
            </View>
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>
                Low : {currentWeather.temperature - 8}°C
              </Text>
              <Text style={styles.tempArrow}>↘</Text>
            </View>
          </View>

          {/* Weather Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>
                {currentWeather.humidity || 65}%
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>
                {currentWeather.windSpeed} km/h
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rain</Text>
              <Text style={styles.detailValue}>24%</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    marginTop: 70,
  },
  weatherCard: {
    width: width * 0.9,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  location: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  bellIcon: {
    fontSize: 16,
  },
  mainWeatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  weatherIconContainer: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  weatherIcon: {
    width: "100%",
    height: "100%",
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 72,
    fontWeight: "300",
    color: "white",
    lineHeight: 72,
  },
  condition: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  highLowContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 16,
  },
  tempItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flex: 1,
  },
  tempLabel: {
    fontSize: 14,
    color: "white",
    flex: 1,
  },
  tempArrow: {
    fontSize: 16,
    color: "white",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
});
