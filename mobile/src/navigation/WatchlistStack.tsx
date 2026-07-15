import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WatchlistScreen } from "../screens/Watchlist/WatchlistScreen";
import { CoinDetailScreen } from "../screens/CoinDetail/CoinDetailScreen";
import { useThemeColors } from "../theme/colors";

export type WatchlistStackParamList = {
  WatchlistList: undefined;
  CoinDetail: { coinId: string };
};

const Stack = createNativeStackNavigator<WatchlistStackParamList>();

export function WatchlistStack() {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: "Manrope_700Bold", color: colors.ink },
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="WatchlistList" component={WatchlistScreen} options={{ title: "Watchlist" }} />
      <Stack.Screen
        name="CoinDetail"
        component={CoinDetailScreen}
        options={{ title: "Coin", headerBackTitle: "Watchlist" }}
      />
    </Stack.Navigator>
  );
}
