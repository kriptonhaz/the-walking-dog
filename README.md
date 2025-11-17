# 🐕 The Walking Dog

> Every walk is a new adventure waiting to happen

**The Walking Dog** is a comprehensive mobile application that helps dog owners plan, track, and optimize their dog walking activities. Combining real-time weather data, AI-powered personalized recommendations, and GPS tracking, this app ensures your furry friend gets the perfect walk every time.

## 🎥 Demo

https://github.com/user-attachments/assets/6540f1d6-db24-46ad-82d4-3ccd2f6e87b5

## ✨ Features

### 🤖 AI-Powered Walk Recommendations
- Personalized walking distance and duration suggestions based on:
  - Dog breed characteristics
  - Age and weight
  - Current weather conditions
  - Humidity and wind speed
- Context-aware explanations for each recommendation

### 🌤️ Real-Time Weather Integration
- Location-based weather updates using Open-Meteo API
- Beautiful animated weather icons for different conditions
- Day/night detection with appropriate UI themes
- Displays temperature, humidity, and wind speed

### 🗺️ GPS Walk Tracking
- Real-time walk path visualization on interactive maps
- Accurate distance tracking (meters)
- Duration tracking with live timer
- Walk achievement celebrations
- Background location tracking support

### 🐾 Multi-Dog Profile Management
- Add and manage multiple dog profiles
- Store detailed information:
  - Name, breed, age, gender, weight
  - Profile photos from camera or gallery
  - Comprehensive breed database
- Each dog gets personalized walk recommendations

### 📅 Walk Journal & History
- Calendar view of all completed walks
- Detailed walk statistics:
  - Date and time
  - Distance walked
  - Duration
  - Associated dog profile
- Trending and analytics visualization

### 🎨 Beautiful UI/UX
- Modern design system powered by Tamagui
- Smooth Lottie animations throughout the app
- Dark/Light mode support
- Responsive design for iOS, Android, and Web

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for macOS) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/the-walking-dog.git
cd the-walking-dog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan the QR code with Expo Go app on your physical device

## 🛠️ Tech Stack

### Core
- **React Native** 0.81.4
- **React** 19.1.0
- **Expo** 54.0.13
- **TypeScript** 5.9.2
- **Expo Router** - File-based routing

### UI & Design
- **Tamagui** - Design system and component library
- **Lottie React Native** - Smooth animations
- **React Native SVG** - Vector graphics
- **Expo Linear Gradient** - Beautiful gradients

### State Management
- **Zustand** - Lightweight state management
- **React Native MMKV** - Fast, persistent storage
- **TanStack React Query** - Data fetching and caching

### APIs & Services
- **Open-Meteo API** - Free weather data
- **OpenRouter AI** - GLM-4.5-Air model for walk recommendations
- **MapLibre React Native** - Offline-first mapping

### Forms & Validation
- **React Hook Form** - Performant forms
- **Zod** - TypeScript-first schema validation

### Additional Features
- **Expo Location** - GPS and geolocation
- **Expo Image Picker** - Photo selection
- **Expo Camera** - Camera access
- **React Native Calendars** - Calendar UI

## 📱 App Structure

```
the-walking-dog/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home/Dashboard
│   │   ├── journal.tsx      # Walk history
│   │   └── setting.tsx      # Settings
│   ├── index.tsx            # Landing screen
│   ├── dog-detail.tsx       # Dog profile form
│   └── walk-map.tsx         # Walk tracking
├── components/              # Reusable components
│   └── ui/                  # Tamagui UI components
├── hooks/                   # Custom React hooks
├── store/                   # Zustand stores
├── services/                # API services
├── assets/                  # Images, animations, data
└── constants/               # Theme and constants
```

## 🔑 Environment Setup

The app uses the following APIs (some require configuration):

1. **Open-Meteo API** - No API key required
2. **OpenRouter AI** - Requires API key for walk recommendations

Create a `.env` file (if needed) or configure API keys in your service files.

## 📝 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## 🎯 Key Features in Detail

### Smart Walk Planning
The app considers multiple factors to recommend the perfect walk:
- Breed-specific exercise requirements
- Age and fitness level
- Real-time weather conditions
- Daily activity goals

### Location-Based Weather
Automatically detects your location and provides:
- Current temperature and conditions
- Humidity levels
- Wind speed
- High/low forecasts

### Achievement Tracking
Keep track of your walking goals:
- Daily distance tracking
- Walk completion celebrations
- Historical data visualization
- Progress trends

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- UI powered by [Tamagui](https://tamagui.dev)
- Weather data from [Open-Meteo](https://open-meteo.com)
- AI recommendations via [OpenRouter](https://openrouter.ai)
- Maps by [MapLibre](https://maplibre.org)

---

Made with ❤️ for dog lovers everywhere
