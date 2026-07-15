import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useWatchlistViewModel } from "../../viewmodels/useWatchlistViewModel";
import { useThemeClasses } from "../../theme/classes";
import { WatchlistStackParamList } from "../../navigation/WatchlistStack";

type Props = NativeStackScreenProps<WatchlistStackParamList, "WatchlistList">;

export function WatchlistScreen({ navigation }: Props) {
  const { items, loading, refreshing, error, offline, refresh } = useWatchlistViewModel();
  const { bg } = useThemeClasses();

  useFocusEffect(
    useCallback(() => {
      refresh({ silent: true });
    }, [refresh])
  );

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={["top"]}>
      <ScreenHeader title="Watchlist" offline={offline} offlineMessage="Offline — showing last synced watchlist" />
      <LoadingErrorEmptyWrapper
        loading={loading && items.length === 0}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="Your watchlist is empty. Add coins from Home."
      >
        <FlatList
          className={`flex-1 px-4 ${bg}`}
          data={items}
          showsVerticalScrollIndicator={false}
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
    </SafeAreaView>
  );
}
