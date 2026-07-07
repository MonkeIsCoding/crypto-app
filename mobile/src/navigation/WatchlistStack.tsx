import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WatchlistScreen } from "../screens/Watchlist/WatchlistScreen";
import { CoinDetailScreen } from "../screens/CoinDetail/CoinDetailScreen";

export type WatchlistStackParamList = {
  WatchlistList: undefined;
  CoinDetail: { coinId: string };
};

const Stack = createNativeStackNavigator<WatchlistStackParamList>();

export function WatchlistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WatchlistList" component={WatchlistScreen} options={{ title: "Watchlist" }} />
      <Stack.Screen name="CoinDetail" component={CoinDetailScreen} options={{ title: "Coin" }} />
    </Stack.Navigator>
  );
}
