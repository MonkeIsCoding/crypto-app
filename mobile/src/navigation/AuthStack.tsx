import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreen } from "../screens/Welcome/WelcomeScreen";
import { AuthScreen } from "../screens/Auth/AuthScreen";

export type AuthStackParamList = {
  Welcome: undefined;
  Auth: { mode: "login" | "register" };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}
