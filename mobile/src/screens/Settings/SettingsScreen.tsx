import React from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsViewModel } from "../../viewmodels/useSettingsViewModel";
import { useThemeColors } from "../../theme/colors";
import { useThemeClasses } from "../../theme/classes";

export function SettingsScreen() {
  const {
    user,
    handleLogout,
    notificationsEnabled,
    toggleNotifications,
    clearingCache,
    handleClearCache,
    deletingAccount,
    handleDeleteAccount,
    isDarkMode,
    toggleDarkMode,
  } = useSettingsViewModel();
  const colors = useThemeColors();
  const { bg, hairline, pillBg, inkText, mutedText } = useThemeClasses();

  const memberSince = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : null;

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={["top"]}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <Text className={`font-sans-extrabold text-[28px] ${inkText} mt-2 mb-6`}>Settings</Text>

        <Text className={`font-sans text-[13px] ${mutedText}`}>Signed in as</Text>
        <Text className={`font-sans-bold text-[16px] ${inkText} mt-1`}>{user?.email}</Text>
        {!user?.emailVerified && (
          <View className="flex-row items-center gap-1 mt-2">
            <Ionicons name="alert-circle" size={14} color="#D97706" />
            <Text className="font-sans-medium text-[12px] text-amber-600">Email not verified</Text>
          </View>
        )}
        {memberSince && <Text className={`font-sans text-[12px] ${mutedText} mt-1`}>Member since {memberSince}</Text>}

        <View className={`flex-row items-center justify-between py-4 mt-6 border-x-0 border-t-0 border-b ${hairline}`}>
          <View className="shrink pr-3">
            <Text className={`font-sans-semibold text-[15px] ${inkText}`}>Appearance</Text>
            <Text className={`font-sans text-[12px] ${mutedText} mt-0.5`}>Light or dark theme</Text>
          </View>
          <View className={`flex-row ${pillBg} rounded-full p-1`}>
            <Pressable
              onPress={() => toggleDarkMode(false)}
              className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full ${!isDarkMode ? bg : ""}`}
            >
              <Ionicons name="sunny" size={14} color={!isDarkMode ? colors.ink : colors.muted} />
              <Text className={`font-sans-medium text-[13px] ${!isDarkMode ? inkText : mutedText}`}>Light</Text>
            </Pressable>
            <Pressable
              onPress={() => toggleDarkMode(true)}
              className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full ${isDarkMode ? bg : ""}`}
            >
              <Ionicons name="moon" size={14} color={isDarkMode ? colors.ink : colors.muted} />
              <Text className={`font-sans-medium text-[13px] ${isDarkMode ? inkText : mutedText}`}>Dark</Text>
            </Pressable>
          </View>
        </View>

        <View className={`flex-row items-center justify-between py-4 border-x-0 border-t-0 border-b ${hairline}`}>
          <View className="shrink pr-3">
            <Text className={`font-sans-semibold text-[15px] ${inkText}`}>Alert notifications</Text>
            <Text className={`font-sans text-[12px] ${mutedText} mt-0.5`}>Push alerts when targets hit</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ true: colors.brandGreen }}
          />
        </View>

        <Pressable
          className={`border ${hairline} rounded-xl p-3.5 items-center ${bg} mt-6`}
          onPress={handleClearCache}
          disabled={clearingCache}
        >
          <Text className={`${inkText} font-sans-semibold text-[15px]`}>
            {clearingCache ? "Clearing..." : "Clear offline cache"}
          </Text>
        </Pressable>

        <Pressable className={`border border-brand-red rounded-xl p-3.5 items-center ${bg} mt-3`} onPress={handleLogout}>
          <Text className="text-brand-red font-sans-semibold text-[15px]">Log out</Text>
        </Pressable>

        <Pressable className="items-center mt-6" onPress={handleDeleteAccount} disabled={deletingAccount}>
          <Text className="text-brand-red font-sans-medium text-[13px]">
            {deletingAccount ? "Deleting account..." : "Delete account"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
