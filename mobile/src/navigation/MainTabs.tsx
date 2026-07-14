import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeStack } from "./HomeStack";
import { WatchlistStack } from "./WatchlistStack";
import { AlertsScreen } from "../screens/Alerts/AlertsScreen";
import { SettingsScreen } from "../screens/Settings/SettingsScreen";
import { colors } from "../theme/colors";

export type MainTabsParamList = {
  Home: undefined;
  Watchlist: undefined;
  Alerts: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const ICONS: Record<keyof MainTabsParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: "home", inactive: "home-outline" },
  Watchlist: { active: "star", inactive: "star-outline" },
  Alerts: { active: "notifications", inactive: "notifications-outline" },
  Settings: { active: "settings", inactive: "settings-outline" },
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.hairline,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: "Manrope_600SemiBold",
          fontSize: 11,
        },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            name={focused ? ICONS[route.name].active : ICONS[route.name].inactive}
            color={color}
            size={size}
          />
        ),
        headerTitleStyle: { fontFamily: "Manrope_700Bold", color: colors.ink },
        headerTintColor: colors.ink,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ popToTopOnBlur: true }} />
      <Tab.Screen name="Watchlist" component={WatchlistStack} options={{ popToTopOnBlur: true }} />
      <Tab.Screen name="Alerts" component={AlertsScreen} options={{ headerShown: true }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
    </Tab.Navigator>
  );
}
