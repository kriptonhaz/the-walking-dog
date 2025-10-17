import { Card, CardContent, CardHeader } from "@/components/ui";
import { Button } from "@/components/ui/button";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  Switch,
  Text,
  View,
  Alert,
} from "react-native";
import { useDogStore } from "@/store/dogStore";
import { useWalkStore } from "@/store/walkStore";

export default function SettingScreen() {
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const { width, height } = Dimensions.get("window");
  
  // Store hooks
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
          text: "Clear Data",
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
        <View className="flex-1 px-6 pt-16">
          {/* Settings Card */}
          <Card
            variant="default"
            padding="lg"
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: "white",
              padding: 20,
            }}
          >
            <CardHeader>
              <View style={{ alignItems: "center" }}>
                <Text className="text-xl font-bold text-text-primary">
                  Settings
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text className="text-lg font-medium text-text-primary">
                  Walk Reminders
                </Text>
                <Switch
                  value={reminderNotifications}
                  onValueChange={setReminderNotifications}
                  trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                  thumbColor={reminderNotifications ? "#ffffff" : "#ffffff"}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
              
              <Button
                title="Clear Data"
                variant="destructive"
                size="md"
                onPress={handleClearData}
                style={{ width: "100%" }}
              />
            </CardContent>
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
}
