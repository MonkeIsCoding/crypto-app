import React, { useCallback } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { useAlerts } from "../../context/AlertsContext";

export function AlertsScreen() {
  const { alerts, loading, refreshing, error, refresh, removeAlert } = useAlerts();

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
        className="flex-1 bg-white px-4"
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
            <View className="py-4 border-x-0 border-t-0 border-b border-hairline bg-white flex-row items-center justify-between">
              <View>
                <Text className="font-sans-bold text-[15px] text-ink">{item.coin?.name ?? item.coin_id}</Text>
                <Text className="font-sans text-[13px] text-muted mt-0.5">
                  {item.type === "above" ? "Above" : "Below"} ${item.target_price.toLocaleString()}
                </Text>
              </View>
              {item.triggered ? (
                <View className="bg-brand-green-light rounded-full px-2.5 py-1">
                  <Text className="text-brand-green font-sans-semibold text-[12px]">Triggered</Text>
                </View>
              ) : (
                <Text className="text-muted font-sans-medium text-[13px]">Watching</Text>
              )}
            </View>
          </Swipeable>
        )}
      />
    </LoadingErrorEmptyWrapper>
  );
}
