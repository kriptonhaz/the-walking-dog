import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createFont } from 'tamagui'
import { themes } from './themes'

const interFont = createFont({
  family: 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 23,
    9: 30,
    10: 46,
    11: 55,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
    true: 14,
  },
  lineHeight: {
    1: 21,
    2: 22,
    3: 23,
    4: 24,
    5: 26,
    6: 28,
    7: 30,
    8: 33,
    9: 40,
    10: 56,
    11: 65,
    12: 72,
    13: 82,
    14: 102,
    15: 124,
    16: 144,
    true: 24,
  },
  weight: {
    1: '100',
    2: '200',
    3: '300',
    4: '400',
    5: '500',
    6: '600',
    7: '700',
    8: '800',
    9: '900',
    true: '400',
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: -1,
    true: 0,
  },
  // For React Native, specify font faces for different weights
  face: {
    100: { normal: 'Inter-Thin' },
    200: { normal: 'Inter-ExtraLight' },
    300: { normal: 'Inter-Light' },
    400: { normal: 'Inter-Regular' },
    500: { normal: 'Inter-Medium' },
    600: { normal: 'Inter-SemiBold' },
    700: { normal: 'Inter-Bold' },
    800: { normal: 'Inter-ExtraBold' },
    900: { normal: 'Inter-Black' },
  },
})

export const config = createTamagui({
  ...defaultConfig,
  fonts: {
    ...defaultConfig.fonts,
    body: interFont,
    heading: interFont,
  },
  themes,
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}