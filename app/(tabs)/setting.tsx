import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Card, CardHeader, CardTitle, CardContent, Button, Alert } from '@/components/ui';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingScreen() {
  const [notifications, setNotifications] = useState(true);
  const [walkReminders, setWalkReminders] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const handleLogout = () => {
    setShowAlert(true);
  };

  const confirmLogout = () => {
    setShowAlert(false);
    // TODO: Implement logout logic
    console.log('User logged out');
  };

  const settingSections = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          description: 'Receive notifications about walks and reminders',
          type: 'toggle' as const,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'walk-reminders',
          title: 'Walk Reminders',
          description: 'Daily reminders to walk your dog',
          type: 'toggle' as const,
          value: walkReminders,
          onToggle: setWalkReminders,
        },
        {
          id: 'weather-alerts',
          title: 'Weather Alerts',
          description: 'Get notified about weather conditions',
          type: 'toggle' as const,
          value: weatherAlerts,
          onToggle: setWeatherAlerts,
        },
      ],
    },
    {
      title: 'Privacy & Data',
      items: [
        {
          id: 'location-tracking',
          title: 'Location Tracking',
          description: 'Allow app to track your walks',
          type: 'toggle' as const,
          value: locationTracking,
          onToggle: setLocationTracking,
        },
        {
          id: 'data-export',
          title: 'Export Data',
          description: 'Download your walking data',
          type: 'navigation' as const,
          onPress: () => console.log('Export data'),
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          type: 'navigation' as const,
          onPress: () => console.log('Privacy policy'),
        },
      ],
    },
    {
      title: 'Dog Profile',
      items: [
        {
          id: 'edit-dog',
          title: 'Edit Dog Information',
          description: 'Update your dog\'s profile',
          type: 'navigation' as const,
          onPress: () => console.log('Edit dog profile'),
        },
        {
          id: 'health-records',
          title: 'Health Records',
          description: 'Manage vaccination and health info',
          type: 'navigation' as const,
          onPress: () => console.log('Health records'),
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          id: 'about',
          title: 'About',
          description: 'App version and information',
          type: 'navigation' as const,
          onPress: () => console.log('About'),
        },
        {
          id: 'help',
          title: 'Help & Support',
          description: 'Get help and contact support',
          type: 'navigation' as const,
          onPress: () => console.log('Help'),
        },
        {
          id: 'logout',
          title: 'Sign Out',
          description: 'Sign out of your account',
          type: 'action' as const,
          onPress: handleLogout,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        className="flex-row items-center justify-between py-4 border-b border-neutral-100"
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View className="flex-1 mr-4">
          <Text className="text-base font-medium text-text-primary mb-1">
            {item.title}
          </Text>
          {item.description && (
            <Text className="text-sm text-text-secondary">
              {item.description}
            </Text>
          )}
        </View>
        
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
            thumbColor={item.value ? '#ffffff' : '#f3f4f6'}
          />
        )}
        
        {item.type === 'navigation' && (
          <Text className="text-neutral-400 text-lg">›</Text>
        )}
        
        {item.type === 'action' && item.id === 'logout' && (
          <Text className="text-red-500 font-medium">Sign Out</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
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

        {/* Profile Card */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: 24 }}>
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">🐕</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-text-primary mb-1">
                Buddy
              </Text>
              <Text className="text-text-secondary">
                Golden Retriever • 3 years old
              </Text>
            </View>
            <Button
              title="Edit"
              variant="outline"
              size="sm"
              onPress={() => console.log('Edit profile')}
            />
          </View>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <Card key={section.title} variant="default" padding="lg" style={{ marginBottom: 16 }}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <View>
                {section.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    {renderSettingItem(item)}
                    {itemIndex < section.items.length - 1 && <View />}
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        ))}

        {/* App Version */}
        <View className="items-center mt-8 mb-4">
          <Text className="text-text-secondary text-sm">
            The Walking Dog v1.0.0
          </Text>
          <Text className="text-text-secondary text-xs mt-1">
            Made with ❤️ for dog lovers
          </Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Alert */}
      {showAlert && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center px-6">
          <Alert
            title="Sign Out"
            description="Are you sure you want to sign out of your account?"
            variant="default"
            onClose={() => setShowAlert(false)}
          />
          <View className="flex-row mt-4 space-x-3">
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowAlert(false)}
              style={{ flex: 1 }}
            />
            <Button
              title="Sign Out"
              variant="destructive"
              onPress={confirmLogout}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}