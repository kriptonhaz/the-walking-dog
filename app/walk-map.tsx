import { Button } from "@/components/ui";
import { DesignSystemColors } from "@/constants/theme";
import { useWalkStore } from "@/store/walkStore";
import { Ionicons } from "@expo/vector-icons";
import MapLibreGL from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Initialize MapLibre
MapLibreGL.setAccessToken(null);

const { width, height } = Dimensions.get("window");

interface WalkStats {
  distance: number;
  duration: number;
  startTime: Date;
}

export default function WalkMapScreen() {
  // Get AI recommendation data and dog ID from navigation params
  const params = useLocalSearchParams();
  const dogId = (params.dogId as string) || "default-dog-id";
  const aiSuggestion = {
    distance: params.suggestedDistance
      ? parseFloat(params.suggestedDistance as string)
      : null,
    duration: params.suggestedDuration
      ? parseInt(params.suggestedDuration as string)
      : null,
    intensity: (params.intensity as string) || null,
    message: (params.message as string) || null,
  };

  // Walk store for saving walk data
  const { addWalk } = useWalkStore();

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isWalking, setIsWalking] = useState(false);
  const [walkStats, setWalkStats] = useState<WalkStats | null>(null);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [walkDuration, setWalkDuration] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [walkPath, setWalkPath] = useState<[number, number][]>([]);

  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const walkTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLocation = useRef<Location.LocationObject | null>(null);
  const previousWalkLocation = useRef<Location.LocationObject | null>(null);
  const cameraRef = useRef<any>(null);
  const zoomLevel = 16;

  // Location tracking useEffect - runs once on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      lastLocation.current = location;

      // Start continuous location tracking for map following
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);

          // Update camera to follow user location immediately
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              centerCoordinate: [
                newLocation.coords.longitude,
                newLocation.coords.latitude,
              ],
              zoomLevel: zoomLevel,
              animationDuration: 500,
              animationMode: "flyTo",
            });
          }

          // Always update lastLocation for map following
          lastLocation.current = newLocation;
        }
      );

      // Store the subscription for cleanup
      locationSubscription.current = subscription;
    })();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // Walking distance tracking useEffect - responds to isWalking and location changes
  useEffect(() => {
    if (isWalking && location && previousWalkLocation.current) {
      const distance = calculateDistance(
        previousWalkLocation.current.coords.latitude,
        previousWalkLocation.current.coords.longitude,
        location.coords.latitude,
        location.coords.longitude
      );

      if (distance > 2) {
        // Only count if moved more than 2 meters
        setCurrentDistance((prev) => prev + distance);
        setWalkPath((prev) => [
          ...prev,
          [location.coords.longitude, location.coords.latitude],
        ]);

        // Update previousWalkLocation after calculating distance
        previousWalkLocation.current = location;
      }
    }
  }, [isWalking, location]);

  // Walking timer useEffect - manages the duration timer
  useEffect(() => {
    if (isWalking) {
      walkTimer.current = setInterval(() => {
        setWalkDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (walkTimer.current) {
        clearInterval(walkTimer.current);
        walkTimer.current = null;
      }
    }

    return () => {
      if (walkTimer.current) {
        clearInterval(walkTimer.current);
      }
    };
  }, [isWalking]);

  useEffect(() => {
    console.log(location);
  }, [location]);

  // Update camera when location changes
  useEffect(() => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: zoomLevel,
        animationDuration: 1000,
        animationMode: "flyTo",
      });
    }
  }, [location]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startWalk = async () => {
    if (!location) return;

    // Remove existing location subscription if it exists
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }

    // Start new location tracking specifically for walking
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (newLocation) => {
        setLocation(newLocation);
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [
              newLocation.coords.longitude,
              newLocation.coords.latitude,
            ],
            zoomLevel: zoomLevel,
            animationDuration: 500,
          });
        }
      }
    );

    const startTime = new Date();
    setIsWalking(true);
    setCurrentDistance(0);
    setWalkDuration(0);
    setWalkPath([[location.coords.longitude, location.coords.latitude]]);
    setWalkStats({
      distance: 0,
      duration: 0,
      startTime: startTime,
    });

    // Initialize previousWalkLocation for distance calculations
    previousWalkLocation.current = location;
  };

  const endWalk = () => {
    // Only clear the walk timer, keep location tracking active
    if (walkTimer.current) {
      clearInterval(walkTimer.current);
      walkTimer.current = null;
    }

    // Save walk data to store
    if (walkStats) {
      const walkEntry = {
        dogId: dogId,
        date: new Date().toISOString().split("T")[0], // Date only (YYYY-MM-DD)
        time: new Date().toISOString(), // Full ISO timestamp
        distance: currentDistance,
        duration: walkDuration,
      };

      addWalk(walkEntry);
    }

    setIsWalking(false);
    setShowAchievementModal(true);
  };

  const handleEndWalk = () => {
    if (isWalking) {
      Alert.alert("End Walk", "Are you sure you want to end this walk?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End Walk",
          style: "destructive",
          onPress: endWalk,
        },
      ]);
    } else {
      startWalk();
    }
  };

  const closeAchievementModal = () => {
    setShowAchievementModal(false);
    router.push("/(tabs)");
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={DesignSystemColors.text.primary}
          />
        </TouchableOpacity>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
            size="md"
          />
        </View>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={DesignSystemColors.text.primary}
          />
        </TouchableOpacity>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={DesignSystemColors.text.primary}
        />
      </TouchableOpacity>

      <MapLibreGL.MapView
        style={styles.map}
        mapStyle={`https://api.maptiler.com/maps/openstreetmap/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_API_KEY}`}
      >
        <MapLibreGL.Camera
          ref={cameraRef}
          centerCoordinate={[
            location.coords.longitude,
            location.coords.latitude,
          ]}
          zoomLevel={zoomLevel}
          animationMode="flyTo"
          animationDuration={1000}
        />

        <MapLibreGL.PointAnnotation
          id="userLocation"
          coordinate={[location.coords.longitude, location.coords.latitude]}
        >
          <View style={styles.userLocationMarker}>
            <View style={styles.userLocationDot} />
          </View>
        </MapLibreGL.PointAnnotation>

        {/* Walk Path */}
        {walkPath.length > 1 && (
          <MapLibreGL.ShapeSource
            id="walkPath"
            shape={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: walkPath,
              },
              properties: {},
            }}
          >
            <MapLibreGL.LineLayer
              id="walkPathLine"
              style={{
                lineColor: DesignSystemColors.primary[500],
                lineWidth: 4,
                lineOpacity: 0.8,
              }}
            />
          </MapLibreGL.ShapeSource>
        )}
      </MapLibreGL.MapView>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        {isWalking ? (
          <>
            <Text style={styles.walkTitle}>Walking in Progress</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round(currentDistance)}m
                </Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatDuration(walkDuration)}
                </Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.walkTitle}>Ready to Walk</Text>
            <Text style={styles.walkSubtitle}>Start tracking your walk!</Text>

            {/* AI Suggestions */}
            {aiSuggestion.distance && aiSuggestion.duration && (
              <View style={styles.aiSuggestionsContainer}>
                <Text style={styles.aiSuggestionsTitle}>
                  AI Recommendations
                </Text>
                <View style={styles.aiSuggestionsRow}>
                  <View style={styles.aiSuggestionItem}>
                    <Text style={styles.aiSuggestionValue}>
                      {aiSuggestion.distance} km
                    </Text>
                    <Text style={styles.aiSuggestionLabel}>
                      Suggested Distance
                    </Text>
                  </View>
                  <View style={styles.aiSuggestionItem}>
                    <Text style={styles.aiSuggestionValue}>
                      {aiSuggestion.duration} min
                    </Text>
                    <Text style={styles.aiSuggestionLabel}>
                      Suggested Duration
                    </Text>
                  </View>
                </View>
                {aiSuggestion.intensity && (
                  <Text style={styles.aiIntensityBadge}>
                    {aiSuggestion.intensity.toUpperCase()} INTENSITY
                  </Text>
                )}
              </View>
            )}
          </>
        )}

        <Button
          title={isWalking ? "End Walk" : "Start Walking"}
          onPress={handleEndWalk}
          variant="primary"
          size="lg"
          style={isWalking ? styles.endWalkButton : styles.startWalkButton}
        />
      </View>

      {/* Achievement Modal */}
      <Modal
        visible={showAchievementModal}
        transparent
        animationType="fade"
        onRequestClose={closeAchievementModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.achievementModal}>
            <Text style={styles.achievementTitle}>🎉 Walk Completed!</Text>
            <View style={styles.achievementStats}>
              <View style={styles.achievementStatItem}>
                <Text style={styles.achievementStatValue}>
                  {Math.round(currentDistance)}m
                </Text>
                <Text style={styles.achievementStatLabel}>Total Distance</Text>
              </View>
              <View style={styles.achievementStatItem}>
                <Text style={styles.achievementStatValue}>
                  {formatDuration(walkDuration)}
                </Text>
                <Text style={styles.achievementStatLabel}>Duration</Text>
              </View>
            </View>
            <Button
              title="Done"
              onPress={closeAchievementModal}
              variant="primary"
              size="lg"
              style={styles.achievementButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystemColors.background.primary,
  },
  map: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  backButton: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DesignSystemColors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: DesignSystemColors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: DesignSystemColors.semantic.error,
    textAlign: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: DesignSystemColors.text.secondary,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DesignSystemColors.primary[500],
    borderWidth: 3,
    borderColor: DesignSystemColors.background.primary,
    shadowColor: DesignSystemColors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DesignSystemColors.background.primary,
    position: "absolute",
    top: 3,
    left: 3,
  },
  controlPanel: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: DesignSystemColors.background.primary,
    borderRadius: 16,
    padding: 20,
    shadowColor: DesignSystemColors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  walkTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: DesignSystemColors.text.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  walkSubtitle: {
    fontSize: 14,
    color: DesignSystemColors.text.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: DesignSystemColors.primary[500],
  },
  statLabel: {
    fontSize: 12,
    color: DesignSystemColors.text.secondary,
    marginTop: 4,
  },
  startWalkButton: {
    backgroundColor: DesignSystemColors.primary[500],
  },
  endWalkButton: {
    backgroundColor: DesignSystemColors.semantic.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  achievementModal: {
    backgroundColor: DesignSystemColors.background.primary,
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: "center",
    shadowColor: DesignSystemColors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  achievementTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: DesignSystemColors.text.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  achievementStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  achievementStatItem: {
    alignItems: "center",
  },
  achievementStatValue: {
    fontSize: 28,
    fontWeight: "700",
    color: DesignSystemColors.primary[500],
  },
  achievementStatLabel: {
    fontSize: 14,
    color: DesignSystemColors.text.secondary,
    marginTop: 4,
  },
  achievementButton: {
    minWidth: 120,
  },
  aiSuggestionsContainer: {
    backgroundColor: DesignSystemColors.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  aiSuggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: DesignSystemColors.text.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  aiSuggestionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  aiSuggestionItem: {
    alignItems: "center",
  },
  aiSuggestionValue: {
    fontSize: 18,
    fontWeight: "700",
    color: DesignSystemColors.primary[500],
  },
  aiSuggestionLabel: {
    fontSize: 11,
    color: DesignSystemColors.text.secondary,
    marginTop: 2,
  },
  aiIntensityBadge: {
    fontSize: 10,
    fontWeight: "600",
    color: DesignSystemColors.primary[600],
    textAlign: "center",
    backgroundColor: DesignSystemColors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "center",
  },
});
