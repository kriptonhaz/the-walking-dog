import breedData from "@/assets/data/breed.json";
import { Button, Card } from "@/components/ui";
import { DesignSystemColors } from "@/constants/theme";
import { useDogStore } from "@/store/dogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const { width, height } = Dimensions.get("window");

// Zod validation schema
const dogFormSchema = z.object({
  name: z.string().min(1, "Dog name is required"),
  breed: z.string().min(1, "Breed is required"),
  born: z.date(),
  gender: z.enum(["male", "female"]),
  weight: z
    .number()
    .min(0.1, "Weight must be greater than 0")
    .max(200, "Weight must be less than 200kg"),
  photo: z.string().optional(),
});

type DogFormData = z.infer<typeof dogFormSchema>;

export default function WalkScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [breedSearch, setBreedSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { addDog } = useDogStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    reset,
  } = useForm<DogFormData>({
    resolver: zodResolver(dogFormSchema),
    defaultValues: {
      born: new Date(),
      gender: "male",
    },
  });

  const watchedBorn = watch("born");
  const watchedBreed = watch("breed");

  const onSubmit = (data: DogFormData) => {
    try {
      // Calculate age from birth date
      const today = new Date();
      const birthDate = new Date(data.born);
      const ageInYears = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const finalAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? ageInYears - 1
          : ageInYears;

      // Create dog object
      const newDog = {
        id: Date.now().toString(), // Simple ID generation
        name: data.name,
        breed: data.breed,
        age: Math.max(0, finalAge), // Ensure age is not negative
        gender: data.gender,
        weight: data.weight,
        photo: selectedImage || undefined,
      };

      // Add dog to store
      addDog(newDog);

      // Reset form
      reset();
      setSelectedImage(null);

      // Navigate to home screen
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error adding dog:", error);
      Alert.alert("Error", "Failed to register dog. Please try again.");
    }
  };

  const pickImage = async () => {
    try {
      // First check current permission status
      const { status: currentStatus } =
        await ImagePicker.getMediaLibraryPermissionsAsync();

      let finalStatus = currentStatus;

      // If permission is not granted, request it
      if (currentStatus !== "granted") {
        const { status: requestStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = requestStatus;
      }

      // Handle different permission states
      if (finalStatus === "denied") {
        Alert.alert(
          "Permission Denied",
          "Photo library access was denied. Please enable it in your device settings to select photos.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                // On iOS, this will open the app settings
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                }
              },
            },
          ]
        );
        return;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photo library to select photos of your dog. Please grant permission when prompted.",
          [{ text: "OK" }]
        );
        return;
      }

      // Permission granted, proceed with image selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setValue("photo", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        "There was an error accessing your photo library. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setValue("photo", result.assets[0].uri);
    }
  };

  const filteredBreeds = breedData.filter((breed) =>
    breed.toLowerCase().includes(breedSearch.toLowerCase())
  );

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue("born", selectedDate);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: DesignSystemColors.background.primary,
      }}
    >
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

      {/* Fixed Card Container */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        <Card
          style={{
            flex: 1,
            backgroundColor: DesignSystemColors.background.secondary,
            shadowColor: DesignSystemColors.neutral[900],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
            borderRadius: 20,
          }}
        >
          {/* Fixed Header */}
          <View
            style={{
              paddingBottom: 10,
              marginBottom: 16,
              paddingHorizontal: 24,
              paddingTop: 24,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: DesignSystemColors.text.primary,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Register Your Dog
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: DesignSystemColors.text.secondary,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Tell us about your furry friend
            </Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Dog Name */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: DesignSystemColors.text.primary,
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 12,
                  letterSpacing: 0.5,
                }}
              >
                Dog Name *
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter your dog's name"
                    placeholderTextColor={DesignSystemColors.text.secondary}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      borderWidth: 2,
                      borderColor: errors.name
                        ? DesignSystemColors.semantic.error
                        : DesignSystemColors.border.default,
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: DesignSystemColors.text.primary,
                      backgroundColor: DesignSystemColors.background.primary,
                      minHeight: 56,
                    }}
                  />
                )}
              />
              {errors.name && (
                <Text
                  style={{
                    color: DesignSystemColors.semantic.error,
                    fontSize: 14,
                    marginTop: 8,
                    marginLeft: 4,
                    fontWeight: "500",
                  }}
                >
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* Breed */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: DesignSystemColors.text.primary,
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 12,
                  letterSpacing: 0.5,
                }}
              >
                Breed *
              </Text>
              <TouchableOpacity
                onPress={() => setShowBreedDropdown(!showBreedDropdown)}
                style={{
                  borderWidth: 2,
                  borderColor: errors.breed
                    ? DesignSystemColors.semantic.error
                    : DesignSystemColors.border.default,
                  borderRadius: 12,
                  padding: 16,
                  backgroundColor: DesignSystemColors.background.primary,
                  minHeight: 56,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: watchedBreed
                      ? DesignSystemColors.text.primary
                      : DesignSystemColors.text.secondary,
                    fontSize: 16,
                  }}
                >
                  {watchedBreed || "Select breed"}
                </Text>
              </TouchableOpacity>
              {showBreedDropdown && (
                <View
                  style={{
                    borderWidth: 2,
                    borderColor: DesignSystemColors.border.default,
                    borderRadius: 12,
                    backgroundColor: DesignSystemColors.background.primary,
                    marginTop: 8,
                    maxHeight: 220,
                    shadowColor: DesignSystemColors.neutral[900],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <TextInput
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: DesignSystemColors.border.muted,
                      fontSize: 16,
                      color: DesignSystemColors.text.primary,
                    }}
                    placeholder="Search breeds..."
                    placeholderTextColor={DesignSystemColors.text.secondary}
                    value={breedSearch}
                    onChangeText={setBreedSearch}
                  />
                  <ScrollView style={{ maxHeight: 160 }}>
                    {filteredBreeds.map((breed, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setValue("breed", breed);
                          clearErrors("breed");
                          setShowBreedDropdown(false);
                          setBreedSearch("");
                        }}
                        style={{
                          padding: 16,
                          borderBottomWidth:
                            index < filteredBreeds.length - 1 ? 1 : 0,
                          borderBottomColor: DesignSystemColors.border.muted,
                        }}
                      >
                        <Text
                          style={{
                            color: DesignSystemColors.text.primary,
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          {breed}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              {errors.breed && (
                <Text
                  style={{
                    color: DesignSystemColors.semantic.error,
                    fontSize: 14,
                    marginTop: 8,
                    marginLeft: 4,
                    fontWeight: "500",
                  }}
                >
                  {errors.breed.message}
                </Text>
              )}
            </View>

            {/* Birth Date */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: DesignSystemColors.text.primary,
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 12,
                  letterSpacing: 0.5,
                }}
              >
                Born *
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  borderWidth: 2,
                  borderColor: errors.born
                    ? DesignSystemColors.semantic.error
                    : DesignSystemColors.border.default,
                  borderRadius: 12,
                  padding: 16,
                  backgroundColor: DesignSystemColors.background.primary,
                  minHeight: 56,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: DesignSystemColors.text.primary,
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  {watchedBorn.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={watchedBorn}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setValue("born", selectedDate);
                    }
                  }}
                />
              )}
              {errors.born && (
                <Text
                  style={{
                    color: DesignSystemColors.semantic.error,
                    fontSize: 14,
                    marginTop: 8,
                    marginLeft: 4,
                    fontWeight: "500",
                  }}
                >
                  {errors.born.message}
                </Text>
              )}
            </View>

            {/* Gender */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: DesignSystemColors.text.primary,
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 12,
                  letterSpacing: 0.5,
                }}
              >
                Gender *
              </Text>
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => onChange("male")}
                      style={{
                        flex: 1,
                        padding: 16,
                        borderWidth: 2,
                        borderColor:
                          value === "male"
                            ? DesignSystemColors.primary[500]
                            : DesignSystemColors.border.default,
                        borderRadius: 12,
                        backgroundColor:
                          value === "male"
                            ? DesignSystemColors.primary[50]
                            : DesignSystemColors.background.primary,
                        minHeight: 56,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            value === "male"
                              ? DesignSystemColors.primary[700]
                              : DesignSystemColors.text.primary,
                          fontSize: 16,
                          fontWeight: value === "male" ? "600" : "500",
                        }}
                      >
                        🐕 Male
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onChange("female")}
                      style={{
                        flex: 1,
                        padding: 16,
                        borderWidth: 2,
                        borderColor:
                          value === "female"
                            ? DesignSystemColors.primary[500]
                            : DesignSystemColors.border.default,
                        borderRadius: 12,
                        backgroundColor:
                          value === "female"
                            ? DesignSystemColors.primary[50]
                            : DesignSystemColors.background.primary,
                        minHeight: 56,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            value === "female"
                              ? DesignSystemColors.primary[700]
                              : DesignSystemColors.text.primary,
                          fontSize: 16,
                          fontWeight: value === "female" ? "600" : "500",
                        }}
                      >
                        🐕‍🦺 Female
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.gender && (
                <Text
                  style={{
                    color: DesignSystemColors.semantic.error,
                    fontSize: 14,
                    marginTop: 8,
                    marginLeft: 4,
                    fontWeight: "500",
                  }}
                >
                  {errors.gender.message}
                </Text>
              )}
            </View>

            {/* Weight */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: DesignSystemColors.text.primary,
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 12,
                  letterSpacing: 0.5,
                }}
              >
                Weight (kg) *
              </Text>
              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter weight in kg"
                    placeholderTextColor={DesignSystemColors.text.secondary}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      const numValue = parseFloat(text);
                      onChange(isNaN(numValue) ? 0 : numValue);
                    }}
                    value={value ? value.toString() : ""}
                    keyboardType="numeric"
                    style={{
                      borderWidth: 2,
                      borderColor: errors.weight
                        ? DesignSystemColors.semantic.error
                        : DesignSystemColors.border.default,
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: DesignSystemColors.text.primary,
                      backgroundColor: DesignSystemColors.background.primary,
                      minHeight: 56,
                    }}
                  />
                )}
              />
              {errors.weight && (
                <Text
                  style={{
                    color: DesignSystemColors.semantic.error,
                    fontSize: 14,
                    marginTop: 8,
                    marginLeft: 4,
                    fontWeight: "500",
                  }}
                >
                  {errors.weight.message}
                </Text>
              )}
            </View>

            {/* Photo */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  color: DesignSystemColors.text.primary,
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 12,
                  letterSpacing: 0.5,
                }}
              >
                Photo
              </Text>
              {selectedImage && (
                <View style={{ marginBottom: 16, alignItems: "center" }}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      borderWidth: 3,
                      borderColor: DesignSystemColors.primary[300],
                    }}
                  />
                </View>
              )}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: DesignSystemColors.border.default,
                    borderRadius: 12,
                    backgroundColor: DesignSystemColors.background.primary,
                    minHeight: 56,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: DesignSystemColors.text.primary,
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    📷 Camera
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: DesignSystemColors.border.default,
                    borderRadius: 12,
                    backgroundColor: DesignSystemColors.background.primary,
                    minHeight: 56,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: DesignSystemColors.text.primary,
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    🖼️ Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Register Dog"
              onPress={handleSubmit(onSubmit)}
              style={{
                backgroundColor: DesignSystemColors.primary[600],
                borderRadius: 16,
                paddingVertical: 18,
                shadowColor: DesignSystemColors.primary[600],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              textStyle={{
                fontSize: 18,
                fontWeight: "700",
                letterSpacing: 0.5,
              }}
            />
          </ScrollView>
        </Card>
      </View>
    </SafeAreaView>
  );
}
