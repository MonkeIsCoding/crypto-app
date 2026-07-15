import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useHomeViewModel } from "../../viewmodels/useHomeViewModel";
import { useThemeClasses } from "../../theme/classes";
import { HomeStackParamList } from "../../navigation/HomeStack";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

export function HomeScreen({ navigation }: Props) {
  const { coins, loading, refreshing, error, offline, loadCoins } = useHomeViewModel();
  const { bg } = useThemeClasses();

  useFocusEffect(
    useCallback(() => {
      loadCoins({ silent: true });
    }, [loadCoins])
  );

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={["top"]}>
      <ScreenHeader title="Home" offline={offline} offlineMessage="Offline — showing last synced prices" />
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
