import React, { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { fetchAlerts, removeAlert } from "../../services/api/alertsApi";
import { Alert } from "../../domain/models/Alert";
import { useAuth } from "../../context/AuthContext";

function coinLabel(coinId: string) {
  return coinId.charAt(0).toUpperCase() + coinId.slice(1);
}

export function AlertsScreen() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAlerts(user.uid);
      setAlerts(data);
    } catch (err) {
      setError("Couldn't load alerts.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleDelete(alertId: string) {
    setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    try {
      await removeAlert(alertId);
    } catch (err) {
      // Roll back on failure and let the user retry.
      load();
    }
  }

  return (
    <LoadingErrorEmptyWrapper
      loading={loading}
      error={error}
      isEmpty={alerts.length === 0}
      emptyMessage="No alerts yet. Create one from a coin's detail page."
    >
      <FlatList
        className="flex-1 bg-white px-4"
        data={alerts}
        keyExtractor={(alert) => alert.id}
        onRefresh={load}
        refreshing={loading}
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
            <View className="py-4 border-b border-hairline bg-white flex-row items-center justify-between">
              <View>
                <Text className="font-sans-bold text-[15px] text-ink">{coinLabel(item.coin_id)}</Text>
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
