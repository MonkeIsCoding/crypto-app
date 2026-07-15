import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "alertNotificationsEnabled";

export async function getAlertNotificationsEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value !== "false";
}

export async function setAlertNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
}
