import React, { useCallback } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { useAlerts } from "../../context/AlertsContext";
import { useTheme } from "../../context/ThemeContext";

export function AlertsScreen() {
  const { alerts, loading, refreshing, error, refresh, removeAlert } = useAlerts();
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? "bg-dark-bg" : "bg-white";
  const hairline = isDarkMode ? "border-dark-hairline" : "border-hairline";
  const inkText = isDarkMode ? "text-dark-ink" : "text-ink";
  const mutedText = isDarkMode ? "text-dark-muted" : "text-muted";
  const greenLightBg = isDarkMode ? "bg-dark-green-light" : "bg-brand-green-light";

  useFocusEffect(
    useCallback(() => {
      refresh({ silent: true });
    }, [refresh])
  );

  async function handleDelete(alertId: string) {
    try {
      await removeAlert(alertId);
    } catch (err) {
      // Roll back on failure and let the user retry.
      refresh({ silent: true });
    }
  }

  return (
    <LoadingErrorEmptyWrapper
      loading={loading && alerts.length === 0}
      error={error}
      isEmpty={alerts.length === 0}
      emptyMessage="No alerts yet. Create one from a coin's detail page."
    >
      <FlatList
        className={`flex-1 ${bg} px-4`}
        data={alerts}
        keyExtractor={(alert) => alert.id}
        onRefresh={() => refresh()}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <Pressable
                className="bg-brand-red justify-center items-center w-[88px] rounded-xl my-1"
                onPress={() => handleDelete(item.id)}
              >
                <Text className="text-white font-sans-semibold text-[15px]">Delete</Text>
              </Pressable>
            )}
          >
            <View className={`py-4 border-x-0 border-t-0 border-b ${hairline} ${bg} flex-row items-center justify-between`}>
              <View>
                <Text className={`font-sans-bold text-[15px] ${inkText}`}>{item.coin?.name ?? item.coin_id}</Text>
                <Text className={`font-sans text-[13px] ${mutedText} mt-0.5`}>
                  {item.type === "above" ? "Above" : "Below"} ${item.target_price.toLocaleString()}
                </Text>
              </View>
              {item.triggered ? (
                <View className={`${greenLightBg} rounded-full px-2.5 py-1`}>
                  <Text className="text-brand-green font-sans-semibold text-[12px]">Triggered</Text>
                </View>
              ) : (
                <Text className={`${mutedText} font-sans-medium text-[13px]`}>Watching</Text>
              )}
            </View>
          </Swipeable>
        )}
      />
    </LoadingErrorEmptyWrapper>
  );
}
