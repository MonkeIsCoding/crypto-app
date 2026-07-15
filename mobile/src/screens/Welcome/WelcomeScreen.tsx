import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { AuthStackParamList } from "../../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? "bg-dark-bg" : "bg-white";
  const hairline = isDarkMode ? "border-dark-hairline" : "border-hairline";
  const inkText = isDarkMode ? "text-dark-ink" : "text-ink";
  const mutedText = isDarkMode ? "text-dark-muted" : "text-muted";

  return (
    <SafeAreaView className={`flex-1 ${bg} px-6`}>
      <View className="flex-1 items-center justify-center">
        <View className="bg-brand-green rounded-3xl w-20 h-20 items-center justify-center mb-6">
          <Ionicons name="trending-up" size={36} color="#fff" />
        </View>
        <Text className={`font-sans-extrabold text-[24px] ${inkText} text-center`}>Track crypto, simply</Text>
        <Text className={`font-sans text-[14px] ${mutedText} text-center mt-2 px-4`}>
          Live prices, watchlists, and price alerts — all in one clean view
        </Text>
      </View>

      <Pressable
        className="bg-brand-green rounded-2xl p-4 items-center mb-3"
        onPress={() => navigation.navigate("Auth", { mode: "register" })}
      >
        <Text className="text-white font-sans-semibold text-[15px]">Create account</Text>
      </Pressable>
      <Pressable
        className={`border ${hairline} rounded-2xl p-4 items-center mb-6`}
        onPress={() => navigation.navigate("Auth", { mode: "login" })}
      >
        <Text className={`font-sans-semibold text-[15px] ${inkText}`}>Log in</Text>
      </Pressable>
    </SafeAreaView>
  );
}
