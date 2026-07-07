import React, { useEffect, useState } from "react";
import { Alert as RNAlert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PriceChart } from "../../components/PriceChart";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { fetchCoin } from "../../services/api/coinsApi";
import { addToWatchlist, fetchWatchlist, removeFromWatchlist } from "../../services/api/watchlistApi";
import { createAlert } from "../../services/api/alertsApi";
import { Coin } from "../../domain/models/Coin";
import { AlertType } from "../../domain/models/Alert";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { WatchlistStackParamList } from "../../navigation/WatchlistStack";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<HomeStackParamList | WatchlistStackParamList, "CoinDetail">;

export function CoinDetailScreen({ route }: Props) {
  const { coinId } = route.params;
  const { user } = useAuth();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [watchlistEntryId, setWatchlistEntryId] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<AlertType>("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [creatingAlert, setCreatingAlert] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCoin(coinId)
      .then((data) => {
        if (!cancelled) setCoin(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this coin.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [coinId]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchWatchlist(user.uid)
      .then((items) => {
        if (cancelled) return;
        const existing = items.find((item) => item.coin_id === coinId);
        setWatchlistEntryId(existing?.id ?? null);
      })
      .catch(() => {
        // Non-critical: button just defaults to "Add to Watchlist".
      });
    return () => {
      cancelled = true;
    };
  }, [user, coinId]);

  async function handleToggleWatchlist() {
    if (!user) return;
    setAddingToWatchlist(true);
    try {
      if (watchlistEntryId) {
        await removeFromWatchlist(watchlistEntryId);
        setWatchlistEntryId(null);
      } else {
        const entry = await addToWatchlist(user.uid, coinId);
        setWatchlistEntryId(entry.id);
      }
    } catch (err) {
      RNAlert.alert("Error", `Couldn't ${watchlistEntryId ? "remove from" : "add to"} watchlist.`);
    } finally {
      setAddingToWatchlist(false);
    }
  }

  async function handleCreateAlert() {
    if (!user) return;
    const parsedPrice = Number(targetPrice);
    if (!targetPrice || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      RNAlert.alert("Invalid price", "Enter a positive target price.");
      return;
    }
    setCreatingAlert(true);
    try {
      await createAlert(user.uid, coinId, alertType, parsedPrice);
      setTargetPrice("");
      RNAlert.alert("Alert created", `You'll be notified when ${coinId} goes ${alertType} $${parsedPrice}.`);
    } catch (err) {
      RNAlert.alert("Error", "Couldn't create alert.");
    } finally {
      setCreatingAlert(false);
    }
  }

  return (
    <LoadingErrorEmptyWrapper loading={loading} error={error} isEmpty={!coin}>
      {coin && (
        <ScrollView className="flex-1 bg-white" contentContainerClassName="p-4">
          <Text className="text-[22px] font-bold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </Text>
          <Text className="text-[32px] font-bold mt-2">${coin.price.toLocaleString()}</Text>
          <Text className={`mt-1 ${coin.price_change_24h >= 0 ? "text-[#2e7d32]" : "text-[#c0392b]"}`}>
            {coin.price_change_24h >= 0 ? "+" : ""}
            {coin.price_change_24h.toFixed(2)}% (24h)
          </Text>

          {/* Historical series isn't cached server-side yet; showing the single latest point. */}
          <PriceChart labels={["now"]} prices={[coin.price]} />

          <View className="flex-row justify-between py-2.5 border-b border-[#ddd]">
            <Text className="text-[#666]">Market cap</Text>
            <Text className="font-semibold">${coin.market_cap.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between py-2.5 border-b border-[#ddd]">
            <Text className="text-[#666]">Last updated</Text>
            <Text className="font-semibold">{new Date(coin.last_updated).toLocaleString()}</Text>
          </View>

          <Pressable
            className={`rounded-lg p-3.5 items-center mt-6 ${watchlistEntryId ? "bg-[#c0392b]" : "bg-[#2e5bff]"}`}
            onPress={handleToggleWatchlist}
            disabled={addingToWatchlist}
          >
            <Text className="text-white font-semibold">
              {addingToWatchlist
                ? watchlistEntryId
                  ? "Removing..."
                  : "Adding..."
                : watchlistEntryId
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
            </Text>
          </Pressable>

          <Text className="text-base font-bold mt-8 mb-2">Create Alert</Text>
          <View className="flex-row gap-2 mb-2">
            <Pressable
              className={`flex-1 border border-[#2e5bff] rounded-lg p-2.5 items-center ${alertType === "above" ? "bg-[#2e5bff]" : ""}`}
              onPress={() => setAlertType("above")}
            >
              <Text className={alertType === "above" ? "text-white font-semibold" : "text-[#2e5bff] font-semibold"}>
                Above
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 border border-[#2e5bff] rounded-lg p-2.5 items-center ${alertType === "below" ? "bg-[#2e5bff]" : ""}`}
              onPress={() => setAlertType("below")}
            >
              <Text className={alertType === "below" ? "text-white font-semibold" : "text-[#2e5bff] font-semibold"}>
                Below
              </Text>
            </Pressable>
          </View>
          <TextInput
            className="border border-[#999] rounded-lg p-3 mb-3"
            placeholder="Target price (USD)"
            keyboardType="decimal-pad"
            value={targetPrice}
            onChangeText={setTargetPrice}
          />
          <Pressable
            className="bg-[#2e5bff] rounded-lg p-3.5 items-center mt-6"
            onPress={handleCreateAlert}
            disabled={creatingAlert}
          >
            <Text className="text-white font-semibold">
              {creatingAlert ? "Creating..." : "Create Alert"}
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </LoadingErrorEmptyWrapper>
  );
}
