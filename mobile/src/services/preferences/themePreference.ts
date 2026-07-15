import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "themePreference";

export async function getThemePreference(): Promise<"light" | "dark"> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value === "dark" ? "dark" : "light";
}

export async function setThemePreference(scheme: "light" | "dark"): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, scheme);
}
