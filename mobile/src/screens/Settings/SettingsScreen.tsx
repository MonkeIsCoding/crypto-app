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
    <View className="flex-1 p-6">
      <Text className="text-[#666]">Signed in as</Text>
      <Text className="text-lg font-semibold mt-1 mb-8">{user?.email}</Text>

      <Pressable className="bg-[#c0392b] rounded-lg p-3.5 items-center" onPress={handleLogout}>
        <Text className="text-white font-semibold">Log out</Text>
      </Pressable>
    </View>
  );
}
