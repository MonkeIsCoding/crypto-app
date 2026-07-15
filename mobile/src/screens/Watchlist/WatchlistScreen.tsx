import React, { useCallback } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { useWatchlist } from "../../context/WatchlistContext";
import { useTheme } from "../../context/ThemeContext";
import { WatchlistStackParamList } from "../../navigation/WatchlistStack";

type Props = NativeStackScreenProps<WatchlistStackParamList, "WatchlistList">;

export function WatchlistScreen({ navigation }: Props) {
  const { items, loading, refreshing, error, offline, refresh } = useWatchlist();
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? "bg-dark-bg" : "bg-white";
  const inkText = isDarkMode ? "text-dark-ink" : "text-ink";
  const banner = isDarkMode ? "bg-amber-900 text-amber-200" : "bg-amber-100 text-amber-800";

  useFocusEffect(
    useCallback(() => {
      refresh({ silent: true });
    }, [refresh])
  );

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={["top"]}>
      <Text className={`font-sans-extrabold text-[28px] ${inkText} px-4 mt-2 mb-2`}>Watchlist</Text>
      {offline && (
        <Text className={`${banner} text-center p-1.5 text-xs font-sans-medium`}>
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
