import { DogPaws } from "@/components/ui";
import { useDogStore } from "@/store/dogStore";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, StatusBar, View } from "react-native";
import { Button, Text } from "tamagui";

const { width, height } = Dimensions.get("window");

export default function LandingScreen() {
  const { dogs } = useDogStore();

  const handleGetStarted = () => {
    if (dogs.length > 0) {
      // If there are dogs in the store, go to home screen
      router.push("/(tabs)");
    } else {
      // If no dogs, go to dog-detail screen to register first dog
      router.push("/dog-detail" as any);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

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
            opacity: 0.8,
          }}
          resizeMode="cover"
        />
      </View>

      <View
        style={{ flex: 1, paddingHorizontal: 24, paddingBottom: 40, zIndex: 1 }}
      >
        {/* Main Content Container */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            minHeight: height - 100,
          }}
        >
          {/* Main Animation - Seamless with Background */}
          <View
            style={{
              width: 280,
              height: 280,
              marginBottom: 24,
              position: "absolute",
              bottom: 50,
            }}
          >
            <LottieView
              source={require("@/assets/animations/dog-walking-1.json")}
              autoPlay
              loop
              style={{ width: "100%", height: "100%" }}
            />
            <View style={{ width: "100%", maxWidth: 280, marginTop: -50 }}>
              <Button
                onPress={handleGetStarted}
                size="$5"
                theme="accent"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  borderRadius: 12,
                }}
              >
                <Text fontWeight="bold" fontSize={20}>
                  Let's Go!
                </Text>
                <DogPaws size={18} color="#ffffff" />
              </Button>
            </View>
          </View>

          {/* Text Content Under Animation */}
          <View
            style={{
              alignItems: "center",
              marginTop: 132,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#1f2937", // equivalent to DesignSystemColors.neutral[800]
                textAlign: "center",
                marginBottom: 8,
                textShadowColor: "rgba(255, 255, 255, 0.8)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Walksy Dog
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#6b7280", // equivalent to DesignSystemColors.neutral[500]
                textAlign: "center",
                fontStyle: "italic",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              "Every walk is a new adventure waiting to happen"
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
