import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useThemeClasses } from "../theme/classes";

interface Props {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

export function LoadingErrorEmptyWrapper({
  loading,
  error,
  isEmpty,
  emptyMessage = "Nothing to show yet.",
  children,
}: Props) {
  const { bg, mutedText } = useThemeClasses();

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center p-6 ${bg}`}>
        <ActivityIndicator size="large" color="#1E7A46" />
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 items-center justify-center p-6 ${bg}`}>
        <Text className="text-brand-red text-center font-sans-medium">{error}</Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className={`flex-1 items-center justify-center p-6 ${bg}`}>
        <Text className={`${mutedText} text-center font-sans`}>{emptyMessage}</Text>
      </View>
    );
  }

  return <>{children}</>;
}
