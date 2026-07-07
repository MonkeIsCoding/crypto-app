import React, { useCallback, useState } from "react";
import { FlatList, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { fetchWatchlist } from "../../services/api/watchlistApi";
import { getCachedWatchlist, replaceCachedWatchlist } from "../../services/sqlite/watchlistCache";
import { WatchlistItem } from "../../domain/models/Watchlist";
import { useAuth } from "../../context/AuthContext";
import { WatchlistStackParamList } from "../../navigation/WatchlistStack";

type Props = NativeStackScreenProps<WatchlistStackParamList, "WatchlistList">;

export function WatchlistScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setOffline(false);
    try {
      const data = await fetchWatchlist(user.uid);
      setItems(data);
      await replaceCachedWatchlist(
        user.uid,
        data.map((item) => ({ user_id: item.user_id, coin_id: item.coin_id, added_at: item.added_at }))
      );
    } catch (err) {
      // Backend/network unavailable — fall back to the last synced SQLite cache.
      const cached = await getCachedWatchlist(user.uid);
      if (cached.length > 0) {
        setOffline(true);
        setItems(cached.map((row) => ({ ...row, id: `${row.user_id}:${row.coin_id}`, coin: null })));
      } else {
        setError("Couldn't load your watchlist.");
      }
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
    <>
      {offline && (
        <Text className="bg-[#fff3cd] text-[#856404] text-center p-1.5 text-xs">
          Offline — showing last synced watchlist
        </Text>
      )}
      <LoadingErrorEmptyWrapper
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="Your watchlist is empty. Add coins from Home."
      >
        <FlatList
          className="flex-1 bg-white"
          data={items}
          keyExtractor={(item) => item.id}
          onRefresh={load}
          refreshing={loading}
          renderItem={({ item }) =>
            item.coin ? (
              <CoinListItem
                coin={item.coin}
                onPress={(coinId) => navigation.navigate("CoinDetail", { coinId })}
              />
            ) : null
          }
        />
      </LoadingErrorEmptyWrapper>
    </>
  );
}
