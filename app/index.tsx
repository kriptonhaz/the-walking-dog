import { Button } from "@/components/ui";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, StatusBar, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function LandingScreen() {
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
            // justifyContent: "center",
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
            {/* Bottom Tagline */}
            <View style={{ marginTop: -40, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#64748b",
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
                fontSize: 32,
                fontWeight: "bold",
                color: "#1e293b",
                textAlign: "center",
                marginBottom: 8,
                textShadowColor: "rgba(255, 255, 255, 0.8)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              The Walking Dog
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#64748b",
                textAlign: "center",
                marginBottom: 16,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              Your companion for healthy adventures
            </Text>
          </View>

          {/* Action Buttons - More Visible */}
          <View style={{ width: "100%", maxWidth: 280, marginBottom: 24 }}>
            <Button
              title="Let's Go! 🐾"
              onPress={() => router.push("/walk" as any)}
              variant="secondary"
              size="lg"
              style={{
                backgroundColor: "#c97c41",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderRadius: 12,
                paddingVertical: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
              textStyle={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#ffffff",
                paddingLeft: 8,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
