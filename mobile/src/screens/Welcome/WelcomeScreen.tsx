import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useThemeClasses } from "../../theme/classes";
import { AppButton } from "../../components/AppButton";
import { AuthStackParamList } from "../../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  const { bg, inkText, mutedText } = useThemeClasses();

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

      <AppButton
        label="Create account"
        large
        className="mb-3"
        onPress={() => navigation.navigate("Auth", { mode: "register" })}
      />
      <AppButton
        label="Log in"
        variant="outline"
        large
        className="mb-6"
        onPress={() => navigation.navigate("Auth", { mode: "login" })}
      />
    </SafeAreaView>
  );
}
