import React from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { useSettingsViewModel } from "../../viewmodels/useSettingsViewModel";

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
  } = useSettingsViewModel();

  const memberSince = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : null;

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="font-sans text-[14px] text-muted">Signed in as</Text>
      <Text className="font-sans-bold text-[17px] text-ink mt-1">{user?.email}</Text>
      {user?.emailVerified ? (
        <View className="bg-brand-green-light rounded-full px-2.5 py-1 self-start mt-2">
          <Text className="text-brand-green font-sans-semibold text-[12px]">Verified</Text>
        </View>
      ) : (
        <Text className="font-sans text-[12px] text-muted mt-2">Email not verified</Text>
      )}
      {memberSince && <Text className="font-sans text-[13px] text-muted mt-1">Member since {memberSince}</Text>}

      <View className="flex-row items-center justify-between py-4 mt-8 border-x-0 border-t-0 border-b border-hairline">
        <Text className="font-sans-medium text-[15px] text-ink">Alert notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} trackColor={{ true: "#1E7A46" }} />
      </View>

      <Pressable
        className="border border-hairline rounded-xl p-3.5 items-center bg-white mt-6"
        onPress={handleClearCache}
        disabled={clearingCache}
      >
        <Text className="text-ink font-sans-semibold text-[15px]">
          {clearingCache ? "Clearing..." : "Clear offline cache"}
        </Text>
      </Pressable>

      <Pressable className="border border-brand-red rounded-xl p-3.5 items-center bg-white mt-3" onPress={handleLogout}>
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
