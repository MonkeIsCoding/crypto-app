import { useEffect, useState } from "react";
import { Alert as RNAlert } from "react-native";
import { logout } from "../services/firebase/authService";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  getAlertNotificationsEnabled,
  setAlertNotificationsEnabled,
} from "../services/preferences/notificationPreference";
import { replaceCachedCoins } from "../services/sqlite/coinsCache";
import { replaceCachedWatchlist } from "../services/sqlite/watchlistCache";
import { deleteAccount as apiDeleteAccount } from "../services/api/accountApi";

export function useSettingsViewModel() {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [clearingCache, setClearingCache] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

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

  async function handleClearCache() {
    if (!user) return;
    setClearingCache(true);
    try {
      await replaceCachedCoins([]);
      await replaceCachedWatchlist(user.uid, []);
      RNAlert.alert("Cache cleared", "Offline data has been cleared.");
    } catch (err) {
      RNAlert.alert("Error", "Couldn't clear the offline cache.");
    } finally {
      setClearingCache(false);
    }
  }

  function handleDeleteAccount() {
    RNAlert.alert(
      "Delete account",
      "This permanently deletes your account, watchlist, and alerts. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingAccount(true);
            try {
              await apiDeleteAccount();
              await logout();
            } catch (err) {
              RNAlert.alert("Error", "Couldn't delete your account.");
            } finally {
              setDeletingAccount(false);
            }
          },
        },
      ]
    );
  }

  return {
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
  };
}
