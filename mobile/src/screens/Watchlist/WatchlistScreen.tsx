import React, { useCallback } from "react";
import { FlatList, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { useWatchlist } from "../../context/WatchlistContext";
import { WatchlistStackParamList } from "../../navigation/WatchlistStack";

type Props = NativeStackScreenProps<WatchlistStackParamList, "WatchlistList">;

export function WatchlistScreen({ navigation }: Props) {
  const { items, loading, refreshing, error, offline, refresh } = useWatchlist();

  useFocusEffect(
    useCallback(() => {
      refresh({ silent: true });
    }, [refresh])
  );

  return (
    <>
      {offline && (
        <Text className="bg-[#fff3cd] text-[#856404] text-center p-1.5 text-xs">
          Offline — showing last synced watchlist
        </Text>
      )}
      <LoadingErrorEmptyWrapper
        loading={loading && items.length === 0}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="Your watchlist is empty. Add coins from Home."
      >
        <FlatList
          className="flex-1 bg-white"
          data={items}
          keyExtractor={(item) => item.id}
          onRefresh={refresh}
          refreshing={refreshing}
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
