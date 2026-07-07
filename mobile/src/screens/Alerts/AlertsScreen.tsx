import React, { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { fetchAlerts } from "../../services/api/alertsApi";
import { Alert } from "../../domain/models/Alert";
import { useAuth } from "../../context/AuthContext";

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

  return (
    <LoadingErrorEmptyWrapper
      loading={loading}
      error={error}
      isEmpty={alerts.length === 0}
      emptyMessage="No alerts yet. Create one from a coin's detail page."
    >
      <FlatList
        className="flex-1 bg-white"
        data={alerts}
        keyExtractor={(alert) => alert.id}
        onRefresh={load}
        refreshing={loading}
        renderItem={({ item }) => (
          <View className="py-3 px-4 border-b border-[#ddd] bg-white">
            <Text className="font-semibold text-base">{item.coin_id}</Text>
            <Text className="text-[#444] mt-0.5">
              {item.type === "above" ? "Above" : "Below"} ${item.target_price.toLocaleString()}
            </Text>
            <Text className={item.triggered ? "text-[#2e7d32] mt-1 font-semibold" : "text-[#888] mt-1"}>
              {item.triggered ? "Triggered" : "Watching"}
            </Text>
          </View>
        )}
      />
    </LoadingErrorEmptyWrapper>
  );
}
