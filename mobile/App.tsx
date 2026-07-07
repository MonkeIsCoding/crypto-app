import "./global.css";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/AuthContext";
import { WatchlistProvider } from "./src/context/WatchlistContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <WatchlistProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </WatchlistProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
