import React, { useCallback } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { useHomeViewModel } from "../../viewmodels/useHomeViewModel";
import { useTheme } from "../../context/ThemeContext";
import { HomeStackParamList } from "../../navigation/HomeStack";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

export function HomeScreen({ navigation }: Props) {
  const { coins, loading, refreshing, error, offline, loadCoins } = useHomeViewModel();
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? "bg-dark-bg" : "bg-white";
  const inkText = isDarkMode ? "text-dark-ink" : "text-ink";
  const banner = isDarkMode ? "bg-amber-900 text-amber-200" : "bg-amber-100 text-amber-800";

  useFocusEffect(
    useCallback(() => {
      loadCoins({ silent: true });
    }, [loadCoins])
  );

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={["top"]}>
      <Text className={`font-sans-extrabold text-[28px] ${inkText} px-4 mt-2 mb-2`}>Home</Text>
      {offline && (
        <Text className={`${banner} text-center p-1.5 text-xs font-sans-medium`}>
          Offline — showing last synced prices
        </Text>
      )}
      <LoadingErrorEmptyWrapper loading={loading && coins.length === 0} error={error} isEmpty={coins.length === 0}>
        <FlatList
          className={`flex-1 px-4 ${bg}`}
          data={coins}
          showsVerticalScrollIndicator={false}
          keyExtractor={(coin) => coin.coin_id}
          onRefresh={loadCoins}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <CoinListItem coin={item} onPress={(coinId) => navigation.navigate("CoinDetail", { coinId })} />
          )}
        />
      </LoadingErrorEmptyWrapper>
    </SafeAreaView>
  );
}
