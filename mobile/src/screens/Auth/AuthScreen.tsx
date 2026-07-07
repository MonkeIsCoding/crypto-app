import React, { useState } from "react";
import { Alert as RNAlert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput } from "react-native";
import { login, register, resetPassword } from "../../services/firebase/authService";
import { colors } from "../../theme/colors";

type Mode = "login" | "register";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center p-6 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="font-sans-extrabold text-[26px] text-ink mb-8 text-center">
        {mode === "login" ? "Log in" : "Create account"}
      </Text>

      <TextInput
        className="border border-hairline rounded-2xl p-4 mb-3 font-sans text-[15px] text-ink"
        placeholder="Email"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-hairline rounded-2xl p-4 mb-4 font-sans text-[15px] text-ink"
        placeholder="Password"
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        className="bg-brand-green rounded-2xl p-4 items-center"
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text className="text-white font-sans-semibold text-[15px]">
          {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
        <Text className="text-brand-green font-sans-medium text-[14px] text-center mt-5">
          {mode === "login" ? "Need an account? Register" : "Have an account? Log in"}
        </Text>
      </Pressable>

      {mode === "login" && (
        <Pressable onPress={handleForgotPassword}>
          <Text className="text-brand-green font-sans-medium text-[14px] text-center mt-3">
            Forgot password?
          </Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}
