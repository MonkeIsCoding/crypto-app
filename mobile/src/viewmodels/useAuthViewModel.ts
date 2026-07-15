import { useState } from "react";
import { Alert as RNAlert } from "react-native";
import { login, register, resetPassword } from "../services/firebase/authService";

type Mode = "login" | "register";

export function useAuthViewModel(initialMode: Mode = "login") {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleMode() {
    setMode((current) => (current === "login" ? "register" : "login"));
  }

  async function handleSubmit() {
    if (!email || !password) {
      RNAlert.alert("Missing fields", "Enter both email and password.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      RNAlert.alert("Authentication error", err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      RNAlert.alert("Enter your email", "Type your email above, then tap 'Forgot password' again.");
      return;
    }
    try {
      await resetPassword(email);
      RNAlert.alert("Check your inbox", "Password reset email sent.");
    } catch (err) {
      RNAlert.alert("Error", err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    toggleMode,
    handleSubmit,
    handleForgotPassword,
  };
}
