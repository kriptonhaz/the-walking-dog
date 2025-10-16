import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button, Input, Dropdown, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

interface Dog {
  name: string;
  born: string;
  gender: 'male' | 'female' | '';
  breed: string;
}

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const breedOptions = [
  { label: 'Golden Retriever', value: 'golden-retriever' },
  { label: 'Labrador Retriever', value: 'labrador-retriever' },
  { label: 'German Shepherd', value: 'german-shepherd' },
  { label: 'Bulldog', value: 'bulldog' },
  { label: 'Poodle', value: 'poodle' },
  { label: 'Beagle', value: 'beagle' },
  { label: 'Rottweiler', value: 'rottweiler' },
  { label: 'Yorkshire Terrier', value: 'yorkshire-terrier' },
  { label: 'Dachshund', value: 'dachshund' },
  { label: 'Siberian Husky', value: 'siberian-husky' },
  { label: 'Mixed Breed', value: 'mixed-breed' },
  { label: 'Other', value: 'other' },
];

export default function DogScreen() {
  const [dog, setDog] = useState<Dog>({
    name: '',
    born: '',
    gender: '',
    breed: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!dog.name.trim()) {
      newErrors.name = 'Dog name is required';
    }

    if (!dog.born.trim()) {
      newErrors.born = 'Birth date is required';
    } else {
      // Basic date validation (YYYY-MM-DD format)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dog.born)) {
        newErrors.born = 'Please enter date in YYYY-MM-DD format';
      }
    }

    if (!dog.gender) {
      newErrors.gender = 'Please select gender';
    }

    if (!dog.breed) {
      newErrors.breed = 'Please select breed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // TODO: Save dog data to storage/context
      console.log('Saving dog:', dog);
      router.push('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 py-8">
        <View className="mb-8">
          <Text className="text-2xl font-bold text-text-primary mb-2">
            Tell us about your dog
          </Text>
          <Text className="text-text-secondary">
            Help us provide the best walking experience for your furry friend
          </Text>
        </View>

        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Dog Information</CardTitle>
          </CardHeader>

          <CardContent>
            <View className="space-y-4">
              <Input
                label="Dog Name"
                placeholder="Enter your dog's name"
                value={dog.name}
                onChangeText={(text) => setDog({ ...dog, name: text })}
                error={errors.name}
              />

              <Input
                label="Birth Date"
                placeholder="YYYY-MM-DD"
                value={dog.born}
                onChangeText={(text) => setDog({ ...dog, born: text })}
                error={errors.born}
                helperText="Enter your dog's birth date"
              />

              <Dropdown
                label="Gender"
                placeholder="Select gender"
                options={genderOptions}
                value={dog.gender}
                onSelect={(option) => setDog({ ...dog, gender: option.value as 'male' | 'female' })}
                error={errors.gender}
              />

              <Dropdown
                label="Breed"
                placeholder="Select breed"
                options={breedOptions}
                value={dog.breed}
                onSelect={(option) => setDog({ ...dog, breed: option.value as string })}
                error={errors.breed}
              />
            </View>
          </CardContent>

          <CardFooter>
            <View className="flex-row space-x-3 w-full">
              <Button
                title="Skip for now"
                onPress={handleSkip}
                variant="ghost"
                size="md"
                style={{ flex: 1 }}
              />
              <Button
                title="Save & Continue"
                onPress={handleSave}
                variant="primary"
                size="md"
                style={{ flex: 1 }}
              />
            </View>
          </CardFooter>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}