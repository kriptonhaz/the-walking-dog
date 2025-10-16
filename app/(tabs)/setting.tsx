import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: "toggle" | "navigation" | "action";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingScreen() {
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const { width, height } = Dimensions.get("window");

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
              Settings
            </Text>
            <Text className="text-text-secondary">
              Customize your walking experience
            </Text>
          </View>

          {/* Reminder Notifications Section */}
          <Card variant="default" padding="lg" style={{ marginBottom: 24 }}>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex-row justify-between items-center py-4">
                <View className="flex-1 mr-4">
                  <Text className="text-lg font-semibold text-text-primary mb-1">
                    Walk Reminders
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    Get daily reminders to walk your dog at your preferred times
                  </Text>
                </View>
                <Switch
                  value={reminderNotifications}
                  onValueChange={setReminderNotifications}
                  trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                  thumbColor={reminderNotifications ? "#ffffff" : "#ffffff"}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>

              {reminderNotifications && (
                <View className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Text className="text-green-800 text-sm font-medium mb-2">
                    ✅ Reminders Enabled
                  </Text>
                  <Text className="text-green-700 text-sm">
                    You'll receive daily notifications to remind you to walk
                    your furry friend. Stay consistent with your walking
                    routine!
                  </Text>
                </View>
              )}

              {!reminderNotifications && (
                <View className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Text className="text-gray-600 text-sm">
                    Reminder notifications are currently disabled. Enable them
                    to stay on track with your dog's walking schedule.
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>

          {/* Coming Soon Section */}
          <Card variant="default" padding="lg" style={{ marginBottom: 24 }}>
            <CardHeader>
              <CardTitle>More Settings Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="items-center py-6">
                <Text className="text-4xl mb-3">⚙️</Text>
                <Text className="text-lg font-semibold text-text-primary mb-2">
                  Additional Features
                </Text>
                <Text className="text-text-secondary text-center text-sm">
                  We're working on more customization options including:
                </Text>
                <View className="mt-4 space-y-2">
                  <Text className="text-text-secondary text-sm">
                    • Weather alerts and notifications
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    • Location tracking preferences
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    • Dog profile management
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    • Data export and privacy controls
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card variant="default" padding="lg">
            <CardContent>
              <View className="items-center py-4">
                <Text className="text-text-secondary text-sm mb-2">
                  The Walking Dog App
                </Text>
                <Text className="text-text-secondary text-xs">
                  Version 1.0.0
                </Text>
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
