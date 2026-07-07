import React, { useState } from "react";
import { Alert as RNAlert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput } from "react-native";
import { login, register, resetPassword } from "../../services/firebase/authService";

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
      className="flex-1 justify-center p-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="text-[28px] font-bold mb-6 text-center">
        {mode === "login" ? "Log in" : "Create account"}
      </Text>

      <TextInput
        className="border border-[#999] rounded-lg p-3 mb-3"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-[#999] rounded-lg p-3 mb-3"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        className="bg-[#2e5bff] rounded-lg p-3.5 items-center mt-2"
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text className="text-white font-semibold">
          {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
        </Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
        <Text className="text-[#2e5bff] text-center mt-4">
          {mode === "login" ? "Need an account? Register" : "Have an account? Log in"}
        </Text>
      </Pressable>

      {mode === "login" && (
        <Pressable onPress={handleForgotPassword}>
          <Text className="text-[#2e5bff] text-center mt-4">Forgot password?</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}
