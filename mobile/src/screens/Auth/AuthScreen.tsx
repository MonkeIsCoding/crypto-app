import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../../components/AppButton";
import { useAuthViewModel } from "../../viewmodels/useAuthViewModel";
import { useThemeColors } from "../../theme/colors";
import { useThemeClasses } from "../../theme/classes";
import { AuthStackParamList } from "../../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Auth">;

export function AuthScreen({ route }: Props) {
  const {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    submitting,
    toggleMode,
    handleSubmit,
    handleForgotPassword,
  } = useAuthViewModel(route.params.mode);
  const colors = useThemeColors();
  const { bg, hairline, inkText } = useThemeClasses();

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1 justify-center p-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text className={`font-sans-extrabold text-[26px] ${inkText} mb-8 text-center`}>
          {mode === "login" ? "Log in" : "Create account"}
        </Text>

        <TextInput
          className={`border ${hairline} rounded-2xl p-4 mb-3 font-sans text-[15px] ${inkText}`}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className={`border ${hairline} rounded-2xl p-4 mb-4 font-sans text-[15px] ${inkText}`}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <AppButton
          label={mode === "login" ? "Log in" : "Create account"}
          large
          busy={submitting}
          busyLabel="Please wait..."
          onPress={handleSubmit}
        />

        <Pressable onPress={toggleMode}>
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
    </SafeAreaView>
  );
}
