import React from "react";
import { Alert as RNAlert, Pressable, Text, View } from "react-native";
import { logout } from "../../services/firebase/authService";
import { useAuth } from "../../context/AuthContext";

export function SettingsScreen() {
  const { user } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      RNAlert.alert("Error", err instanceof Error ? err.message : "Couldn't log out");
    }
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="font-sans text-[14px] text-muted">Signed in as</Text>
      <Text className="font-sans-bold text-[17px] text-ink mt-1 mb-8">{user?.email}</Text>

      <Pressable
        className="border border-brand-red rounded-xl p-3.5 items-center bg-white"
        onPress={handleLogout}
      >
        <Text className="text-brand-red font-sans-semibold text-[15px]">Log out</Text>
      </Pressable>
    </View>
  );
}
