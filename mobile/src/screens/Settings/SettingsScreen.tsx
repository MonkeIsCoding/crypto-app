import React from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { useSettingsViewModel } from "../../viewmodels/useSettingsViewModel";
import { useThemeColors } from "../../theme/colors";

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

  const bg = isDarkMode ? "bg-dark-bg" : "bg-white";
  const hairline = isDarkMode ? "border-dark-hairline" : "border-hairline";
  const inkText = isDarkMode ? "text-dark-ink" : "text-ink";
  const mutedText = isDarkMode ? "text-dark-muted" : "text-muted";
  const greenLightBg = isDarkMode ? "bg-dark-green-light" : "bg-brand-green-light";

  const memberSince = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : null;

  return (
    <View className={`flex-1 p-4 ${bg}`}>
      <Text className={`font-sans text-[14px] ${mutedText}`}>Signed in as</Text>
      <Text className={`font-sans-bold text-[17px] ${inkText} mt-1`}>{user?.email}</Text>
      {user?.emailVerified ? (
        <View className={`${greenLightBg} rounded-full px-2.5 py-1 self-start mt-2`}>
          <Text className="text-brand-green font-sans-semibold text-[12px]">Verified</Text>
        </View>
      ) : (
        <Text className={`font-sans text-[12px] ${mutedText} mt-2`}>Email not verified</Text>
      )}
      {memberSince && <Text className={`font-sans text-[13px] ${mutedText} mt-1`}>Member since {memberSince}</Text>}

      <View className={`flex-row items-center justify-between py-4 mt-8 border-x-0 border-t-0 border-b ${hairline}`}>
        <Text className={`font-sans-medium text-[15px] ${inkText}`}>Alert notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ true: colors.brandGreen }}
        />
      </View>

      <View className={`flex-row items-center justify-between py-4 border-x-0 border-t-0 border-b ${hairline}`}>
        <Text className={`font-sans-medium text-[15px] ${inkText}`}>Dark mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ true: colors.brandGreen }} />
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

      <Pressable className="items-center mt-8" onPress={handleDeleteAccount} disabled={deletingAccount}>
        <Text className="text-brand-red font-sans-medium text-[13px]">
          {deletingAccount ? "Deleting account..." : "Delete account"}
        </Text>
      </Pressable>
    </View>
  );
}
