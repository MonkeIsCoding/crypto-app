import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/Home/HomeScreen";
import { CoinDetailScreen } from "../screens/CoinDetail/CoinDetailScreen";
import { useThemeColors } from "../theme/colors";

export type HomeStackParamList = {
  HomeList: undefined;
  CoinDetail: { coinId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
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
      <Stack.Screen name="HomeList" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CoinDetail" component={CoinDetailScreen} options={{ title: "Coin", headerBackTitle: "Home" }} />
    </Stack.Navigator>
  );
}
