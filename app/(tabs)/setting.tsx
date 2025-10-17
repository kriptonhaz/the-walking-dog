import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DesignSystemColors } from "@/constants/theme";
import { useDogStore } from "@/store/dogStore";
import { useWalkStore } from "@/store/walkStore";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: DesignSystemColors.text.primary,
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: DesignSystemColors.text.primary,
  },
});

const { width, height } = Dimensions.get("window");

export default function SettingScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const clearAllDogs = useDogStore((state) => state.clearAll);
  const clearAllWalks = useWalkStore((state) => state.clearAll);

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all dog and walk data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearAllDogs();
            clearAllWalks();
            Alert.alert("Success", "All data has been cleared.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.content}>
        <Card
          style={{
            width: "90%",
            alignSelf: "center",
            backgroundColor: "white",
          }}
        >
          <CardHeader>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.settingsTitle}>Settings</Text>
            </View>
          </CardHeader>
          <CardContent>
            <View style={styles.notificationRow}>
              <Text style={styles.notificationLabel}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>
            <View style={{ marginTop: 16 }}>
              <Button
                title="Clear Data"
                variant="destructive"
                onPress={handleClearData}
                style={{ width: "100%" }}
              />
            </View>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
