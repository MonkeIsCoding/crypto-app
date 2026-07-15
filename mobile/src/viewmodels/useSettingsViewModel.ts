import { useEffect, useState } from "react";
import { Alert as RNAlert } from "react-native";
import { logout } from "../services/firebase/authService";
import { useAuth } from "../context/AuthContext";
import {
  getAlertNotificationsEnabled,
  setAlertNotificationsEnabled,
} from "../services/preferences/notificationPreference";

export function useSettingsViewModel() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    getAlertNotificationsEnabled().then(setNotificationsEnabled);
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      RNAlert.alert("Error", err instanceof Error ? err.message : "Couldn't log out");
    }
  }

  async function toggleNotifications(enabled: boolean) {
    setNotificationsEnabled(enabled);
    await setAlertNotificationsEnabled(enabled);
  }

  return {
    user,
    handleLogout,
    notificationsEnabled,
    toggleNotifications,
  };
}
