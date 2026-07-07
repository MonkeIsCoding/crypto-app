import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { fetchCoins } from "../../services/api/coinsApi";
import { Coin } from "../../domain/models/Coin";
import { HomeStackParamList } from "../../navigation/HomeStack";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

export function HomeScreen({ navigation }: Props) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCoins();
      setCoins(data);
    } catch (err) {
      setError("Couldn't load coins. Pull to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  return (
    <LoadingErrorEmptyWrapper loading={loading} error={error} isEmpty={coins.length === 0}>
      <FlatList
        className="flex-1 bg-white"
        data={coins}
        keyExtractor={(coin) => coin.coin_id}
        onRefresh={loadCoins}
        refreshing={loading}
        renderItem={({ item }) => (
          <CoinListItem coin={item} onPress={(coinId) => navigation.navigate("CoinDetail", { coinId })} />
        )}
      />
    </LoadingErrorEmptyWrapper>
  );
}
