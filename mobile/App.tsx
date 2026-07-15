import "./global.css";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { WatchlistProvider } from "./src/context/WatchlistContext";
import { AlertsProvider } from "./src/context/AlertsContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

function AppContent() {
  const { isDarkMode, isReady } = useTheme();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded || !isReady) {
    return (
      <View className={`flex-1 items-center justify-center ${isDarkMode ? "bg-dark-bg" : "bg-white"}`}>
        <ActivityIndicator size="large" color="#1E7A46" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <WatchlistProvider>
          <AlertsProvider>
            <RootNavigator />
            <StatusBar style={isDarkMode ? "light" : "dark"} />
          </AlertsProvider>
        </WatchlistProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
