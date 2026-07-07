import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeStack } from "./HomeStack";
import { WatchlistStack } from "./WatchlistStack";
import { AlertsScreen } from "../screens/Alerts/AlertsScreen";
import { SettingsScreen } from "../screens/Settings/SettingsScreen";

export type MainTabsParamList = {
  Home: undefined;
  Watchlist: undefined;
  Alerts: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Watchlist" component={WatchlistStack} />
      <Tab.Screen name="Alerts" component={AlertsScreen} options={{ headerShown: true }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
    </Tab.Navigator>
  );
}
