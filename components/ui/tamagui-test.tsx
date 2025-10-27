import React from 'react';
import { YStack, XStack, H1, H2, Paragraph, Button, Card } from 'tamagui';

export function TamaguiTest() {
  return (
    <Card elevate size="$4" bordered>
      <Card.Header padded>
        <H2>Tamagui Test Component</H2>
        <Paragraph>
          This component tests that Tamagui is working correctly
        </Paragraph>
      </Card.Header>
      
      <YStack p="$4" gap="$4">
        <H1 color="$green10">Hello Tamagui!</H1>
        
        <Paragraph size="$5" fontWeight="600">
          This text uses Tamagui's typography system with Inter font.
        </Paragraph>
        
        <XStack gap="$3">
          <Button theme="accent" size="$4">
            Primary Button
          </Button>
          <Button variant="outlined" size="$4">
            Secondary Button
          </Button>
        </XStack>
        
        <YStack gap="$2">
          <Paragraph size="$3">
            Theme colors and spacing work correctly
          </Paragraph>
          <Paragraph color="$green10" size="$3">
            Custom colors are available
          </Paragraph>
        </YStack>
      </YStack>
    </Card>
  );
}