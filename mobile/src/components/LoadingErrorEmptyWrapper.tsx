import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

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
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-[#c0392b] text-center">{error}</Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-[#7f8c8d] text-center">{emptyMessage}</Text>
      </View>
    );
  }

  return <>{children}</>;
}
