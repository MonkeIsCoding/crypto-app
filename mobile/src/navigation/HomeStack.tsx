import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/Home/HomeScreen";
import { CoinDetailScreen } from "../screens/CoinDetail/CoinDetailScreen";

export type HomeStackParamList = {
  HomeList: undefined;
  CoinDetail: { coinId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeList" component={HomeScreen} options={{ title: "Home" }} />
      <Stack.Screen name="CoinDetail" component={CoinDetailScreen} options={{ title: "Coin" }} />
    </Stack.Navigator>
  );
}
