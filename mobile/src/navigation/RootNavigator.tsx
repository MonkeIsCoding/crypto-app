import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { AuthScreen } from "../screens/Auth/AuthScreen";
import { MainTabs } from "./MainTabs";

export function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <NavigationContainer>{user ? <MainTabs /> : <AuthScreen />}</NavigationContainer>;
}
