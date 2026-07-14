import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PriceChart } from "../../components/PriceChart";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { useCoinDetailViewModel } from "../../viewmodels/useCoinDetailViewModel";
import { HomeStackParamList } from "../../navigation/HomeStack";
import { WatchlistStackParamList } from "../../navigation/WatchlistStack";
import { colors } from "../../theme/colors";

type Props = NativeStackScreenProps<HomeStackParamList | WatchlistStackParamList, "CoinDetail">;

export function CoinDetailScreen({ route }: Props) {
  const { coinId } = route.params;
  const {
    coin,
    loading,
    error,
    watchlistEntryId,
    addingToWatchlist,
    handleToggleWatchlist,
    alertType,
    setAlertType,
    targetPrice,
    setTargetPrice,
    creatingAlert,
    handleCreateAlert,
  } = useCoinDetailViewModel(coinId);

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
