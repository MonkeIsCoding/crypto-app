import React, { useEffect, useState } from "react";
import { Alert as RNAlert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PriceChart } from "../../components/PriceChart";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { fetchCoin } from "../../services/api/coinsApi";
import { createAlert } from "../../services/api/alertsApi";
import { Coin } from "../../domain/models/Coin";
import { AlertType } from "../../domain/models/Alert";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { WatchlistStackParamList } from "../../navigation/WatchlistStack";
import { useAuth } from "../../context/AuthContext";
import { useWatchlist } from "../../context/WatchlistContext";
import { colors } from "../../theme/colors";

type Props = NativeStackScreenProps<HomeStackParamList | WatchlistStackParamList, "CoinDetail">;

export function CoinDetailScreen({ route }: Props) {
  const { coinId } = route.params;
  const { user } = useAuth();
  const { isWatchlisted, addCoin, removeCoin } = useWatchlist();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [creatingAlert, setCreatingAlert] = useState(false);

  const watchlistEntryId = isWatchlisted(coinId);

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

  async function handleToggleWatchlist() {
    if (!user) return;
    setAddingToWatchlist(true);
    try {
      if (watchlistEntryId) {
        await removeCoin(coinId);
      } else {
        await addCoin(coinId);
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
      await createAlert(coinId, alertType, parsedPrice);
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
        <ScrollView
          className="flex-1 bg-white"
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        >
          <Text className="font-sans-medium text-[15px] text-muted">
            {coin.name} · {coin.symbol.toUpperCase()}
          </Text>
          <Text className="font-sans-extrabold text-[34px] text-ink mt-1 tabular-nums">
            ${coin.price.toLocaleString()}
          </Text>
          <Text
            className={`font-sans-semibold text-[15px] mt-1 ${coin.price_change_24h >= 0 ? "text-brand-green" : "text-brand-red"}`}
          >
            {coin.price_change_24h >= 0 ? "+" : ""}
            {coin.price_change_24h.toFixed(2)}% Today
          </Text>

          <PriceChart
            labels={
              coin.price_history.length > 0
                ? coin.price_history.map((point) =>
                    new Date(point.timestamp).toLocaleDateString(undefined, { weekday: "short" })
                  )
                : ["now"]
            }
            prices={coin.price_history.length > 0 ? coin.price_history.map((point) => point.price) : [coin.price]}
            isPositive={coin.price_change_24h >= 0}
          />

          <View className="flex-row justify-between py-3.5 bg-white border-x-0 border-t-0 border-b border-hairline">
            <Text className="font-sans text-[14px] text-muted">Market cap</Text>
            <Text className="font-sans-semibold text-[14px] text-ink tabular-nums">
              ${coin.market_cap.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between py-3.5 bg-white border-x-0 border-t-0 border-b border-hairline">
            <Text className="font-sans text-[14px] text-muted">Last updated</Text>
            <Text className="font-sans-semibold text-[14px] text-ink">
              {new Date(coin.last_updated).toLocaleString()}
            </Text>
          </View>

          <Pressable
            className={`rounded-xl border p-3.5 items-center mt-6 bg-white ${watchlistEntryId ? "border-brand-red" : "border-brand-green"}`}
            onPress={handleToggleWatchlist}
            disabled={addingToWatchlist}
          >
            <Text
              className={`font-sans-semibold text-[15px] ${watchlistEntryId ? "text-brand-red" : "text-brand-green"}`}
            >
              {addingToWatchlist
                ? watchlistEntryId
                  ? "Removing..."
                  : "Adding..."
                : watchlistEntryId
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
            </Text>
          </Pressable>

          <Text className="font-sans-bold text-[17px] text-ink mt-8 mb-3">Create alert</Text>
          <View className="flex-row gap-2 mb-3">
            <Pressable
              className={`flex-1 rounded-xl p-3 items-center border ${alertType === "above" ? "bg-brand-green border-brand-green" : "bg-white border-hairline"}`}
              onPress={() => setAlertType("above")}
            >
              <Text
                className={`font-sans-semibold text-[15px] ${alertType === "above" ? "text-white" : "text-ink"}`}
              >
                Above
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-xl p-3 items-center border ${alertType === "below" ? "bg-brand-green border-brand-green" : "bg-white border-hairline"}`}
              onPress={() => setAlertType("below")}
            >
              <Text
                className={`font-sans-semibold text-[15px] ${alertType === "below" ? "text-white" : "text-ink"}`}
              >
                Below
              </Text>
            </Pressable>
          </View>
          <TextInput
            className="border border-hairline rounded-xl p-3.5 mb-3 font-sans text-[15px] text-ink"
            placeholder="Target price (USD)"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            value={targetPrice}
            onChangeText={setTargetPrice}
          />
          <Pressable
            className="bg-brand-green rounded-xl p-3.5 items-center"
            onPress={handleCreateAlert}
            disabled={creatingAlert}
          >
            <Text className="text-white font-sans-semibold text-[15px]">
              {creatingAlert ? "Creating..." : "Create alert"}
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </LoadingErrorEmptyWrapper>
  );
}
