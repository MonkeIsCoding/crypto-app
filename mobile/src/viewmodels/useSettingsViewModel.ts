import { Alert as RNAlert } from "react-native";
import { logout } from "../services/firebase/authService";
import { useAuth } from "../context/AuthContext";

export function useSettingsViewModel() {
  const { user } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      RNAlert.alert("Error", err instanceof Error ? err.message : "Couldn't log out");
    }
  }

  return { user, handleLogout };
}
