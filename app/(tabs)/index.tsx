import { Button } from "@/components/ui/button";
import { DesignSystemColors } from "@/constants/theme";
import {
  useAiOpenRouter,
  WalkRecommendationRequest,
} from "@/hooks/use-ai-openrouter";
import { useWeather } from "@/hooks/use-weather";
import { WeatherService } from "@/services/weather-api";
import { useDogStore } from "@/store/dogStore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  weight?: number;
  gender?: "male" | "female";
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
  const { dogs, clearAll } = useDogStore();
  const { weather, isLoading: isLoadingWeather, refetch } = useWeather();

  // Welcome message state
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentWeather = weather || WeatherService.getMockWeather();
  const currentDog = dogs.length > 0 ? dogs[0] : mockDog;

  // Prepare AI recommendation request
  const aiRequest: WalkRecommendationRequest | null = useMemo(() => {
    if (!currentWeather || !currentDog) return null;

    return {
      dogBreed: currentDog.breed,
      dogAge: currentDog.age,
      dogWeight: currentDog.weight || 25, // Default weight if not provided
      dogGender: currentDog.gender || "male", // Default gender if not provided
      weather: {
        temperature: currentWeather.temperature,
        condition: currentWeather.condition,
        humidity: currentWeather.humidity || 65,
        windSpeed: currentWeather.windSpeed,
      },
      location: currentWeather.location,
    };
  }, [currentWeather, currentDog]);

  // Use AI recommendation hook with caching
  const {
    data: aiRecommendation,
    isLoading: isLoadingAI,
    error: aiError,
  } = useAiOpenRouter(aiRequest, {
    enabled: !!aiRequest,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    gcTime: 1000 * 60 * 60, // 1 hour garbage collection
  });

  // Rotate welcome message every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % welcomeMessages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Typing effect for welcome messages
  useEffect(() => {
    const currentMessage = welcomeMessages[currentMessageIndex];
    setDisplayedText("");
    setIsTyping(true);

    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50); // 50ms per character for smooth typing

    return () => clearInterval(typingInterval);
  }, [currentMessageIndex]);

  const handleStartWalk = () => {
    // Pass AI recommendation data and dog ID to walk-map screen
    const params = {
      dogId: dogs.length > 0 ? dogs[0].id : "default-dog-id",
      ...(aiRecommendation
        ? {
            suggestedDistance: aiRecommendation.recommendation.distance_km,
            suggestedDuration: aiRecommendation.recommendation.duration_min,
            intensity: aiRecommendation.recommendation.intensity,
            message: aiRecommendation.message,
          }
        : {}),
    };

    router.push({
      pathname: "/walk-map",
      params,
    } as any);
  };

  useEffect(() => {
    console.log(weather);
    console.log("AI Recommendation:", aiRecommendation);
  }, [weather, dogs, aiRecommendation]);

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
    <View style={styles.container}>
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
      {/* Dog Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          decelerationRate="fast"
          snapToInterval={width * 0.9 + 16}
          snapToAlignment="center"
          bounces={false}
          pagingEnabled={dogs.length === 1}
        >
          {dogs.length > 0 ? (
            dogs.map((dog, index) => (
              <View key={dog.id} style={styles.dogCard}>
                {/* Colored stripe on the left */}
                <View style={styles.colorStripe} />
                
                <View style={styles.dogCardContent}>
                  {/* Left Section - Dog Info */}
                  <View style={styles.dogInfoSection}>
                    <View style={styles.dogAvatarContainer}>
                      {dog.photo ? (
                        <Image
                          source={{ uri: dog.photo }}
                          style={styles.dogAvatar}
                          resizeMode="cover"
                          onError={(error) => {
                            console.log(
                              "Image load error:",
                              error.nativeEvent.error
                            );
                          }}
                        />
                      ) : (
                        <View style={styles.dogAvatarPlaceholder}>
                          <Text style={styles.dogAvatarText}>🐕</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.dogName}>{dog.name}</Text>
                    <Text style={styles.dogBreed}>{dog.breed}</Text>
                    <Text style={styles.dogAge}>{dog.age} years old</Text>
                    {dog.weight && (
                      <Text style={styles.dogWeight}>{dog.weight} kg</Text>
                    )}
                  </View>

                  {/* Right Section - AI Walking Suggestions */}
                  <View style={styles.aiSuggestionsSection}>
                    <Text style={styles.aiSectionTitle}>
                      Walking Suggestions
                    </Text>
                    <View style={styles.aiContentContainer}>
                      {isLoadingAI ? (
                        <>
                          <LottieView
                            source={require("@/assets/animations/dog-walking-2.json")}
                            autoPlay
                            loop
                            style={styles.walkingAnimation}
                          />
                          <Text style={styles.aiLoadingText}>
                            Getting personalized suggestions...
                          </Text>
                        </>
                      ) : aiError ? (
                        <Text style={styles.aiErrorText}>
                          Unable to get suggestions
                        </Text>
                      ) : aiRecommendation ? (
                        <View style={styles.aiRecommendationContainer}>
                          <Text style={styles.aiRecommendationText}>
                            {aiRecommendation.recommendation.distance_km} km
                            walk
                          </Text>
                          <Text style={styles.aiRecommendationText}>
                            {aiRecommendation.recommendation.duration_min}{" "}
                            minutes
                          </Text>
                          <Text style={styles.aiIntensityText}>
                            {aiRecommendation.recommendation.intensity.toUpperCase()}{" "}
                            intensity
                          </Text>
                        </View>
                      ) : (
                        <>
                          <LottieView
                            source={require("@/assets/animations/dog-walking-2.json")}
                            autoPlay
                            loop
                            style={styles.walkingAnimation}
                          />
                          <Text style={styles.aiLoadingText}>
                            Getting personalized suggestions...
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.dogCard}>
              <View style={styles.colorStripe} />
              <View style={styles.dogCardContent}>
                <View style={styles.dogInfoSection}>
                  <View style={styles.dogAvatarContainer}>
                    <View style={styles.dogAvatarPlaceholder}>
                      <Text style={styles.dogAvatarText}>🐕</Text>
                    </View>
                  </View>
                  <Text style={styles.dogName}>{mockDog.name}</Text>
                  <Text style={styles.dogBreed}>{mockDog.breed}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Take a Walk Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={displayedText + (isTyping ? "|" : "")}
          onPress={handleStartWalk}
          variant="primary"
          size="lg"
          style={styles.walkButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weatherCard: {
    alignSelf: "center",
    marginTop: 70,
    width: width * 0.9,
    borderRadius: 24,
    height: undefined,
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
  carouselContainer: {
    marginTop: 20,
  },
  carouselContent: {
    paddingHorizontal: width * 0.05, // Same padding as weather card to align properly
  },
  dogCard: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 0,
    marginRight: 16,
    minHeight: height * 0.25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    flexDirection: "row" as const,
    overflow: "hidden" as const,
  },
  colorStripe: {
    width: 10,
    backgroundColor: DesignSystemColors.primary[500],
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  dogAvatarContainer: {
    marginBottom: 16,
  },
  dogAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  dogAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  dogAvatarText: {
    fontSize: 32,
  },
  dogName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
    textAlign: "center" as const,
  },
  dogBreed: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center" as const,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
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
  mainWeatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: width * 0.05,
  },
  walkButton: {
    width: width * 0.9,
    alignSelf: "center",
  },
  dogCardContent: {
    flexDirection: "row" as const,
    flex: 1,
    alignItems: "stretch" as const,
    padding: 20,
  },
  dogInfoSection: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingRight: 12,
  },
  dogAge: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center" as const,
    marginTop: 2,
  },
  dogWeight: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center" as const,
    marginTop: 2,
  },
  aiSuggestionsSection: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  aiSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center" as const,
  },
  aiContentContainer: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flex: 1,
  },
  walkingAnimation: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  aiLoadingText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center" as const,
    lineHeight: 16,
  },
  aiErrorText: {
    fontSize: 12,
    color: "rgba(255, 100, 100, 0.9)",
    textAlign: "center" as const,
    lineHeight: 16,
  },
  aiRecommendationContainer: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  aiRecommendationText: {
    fontSize: 13,
    color: "#374151",
    textAlign: "center" as const,
    marginBottom: 4,
    fontWeight: "500",
  },
  aiIntensityText: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center" as const,
    fontWeight: "600",
    marginTop: 4,
  },
});
