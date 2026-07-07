import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { fetchCoins } from "../../services/api/coinsApi";
import { getCachedCoins, replaceCachedCoins } from "../../services/sqlite/coinsCache";
import { Coin } from "../../domain/models/Coin";
import { HomeStackParamList } from "../../navigation/HomeStack";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

export function HomeScreen({ navigation }: Props) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const loadCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOffline(false);
    try {
      const data = await fetchCoins();
      setCoins(data);
      await replaceCachedCoins(data);
    } catch (err) {
      // Backend/network unavailable — fall back to the last synced SQLite cache.
      const cached = await getCachedCoins();
      if (cached.length > 0) {
        setOffline(true);
        setCoins(cached);
      } else {
        setError("Couldn't load coins. Pull to retry.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  return (
    <>
      {offline && (
        <Text className="bg-[#fff3cd] text-[#856404] text-center p-1.5 text-xs font-sans-medium">
          Offline — showing last synced prices
        </Text>
      )}
      <LoadingErrorEmptyWrapper loading={loading} error={error} isEmpty={coins.length === 0}>
        <FlatList
          className="flex-1 px-4 bg-white"
          data={coins}
          showsVerticalScrollIndicator={false}
          keyExtractor={(coin) => coin.coin_id}
          onRefresh={loadCoins}
          refreshing={loading}
          renderItem={({ item }) => (
            <CoinListItem coin={item} onPress={(coinId) => navigation.navigate("CoinDetail", { coinId })} />
          )}
        />
      </LoadingErrorEmptyWrapper>
    </>
  );
}
