import React, { useEffect } from "react";
import { FlatList, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CoinListItem } from "../../components/CoinListItem";
import { LoadingErrorEmptyWrapper } from "../../components/LoadingErrorEmptyWrapper";
import { useHomeViewModel } from "../../viewmodels/useHomeViewModel";
import { HomeStackParamList } from "../../navigation/HomeStack";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeList">;

export function HomeScreen({ navigation }: Props) {
  const { coins, loading, refreshing, error, offline, loadCoins } = useHomeViewModel();

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
      <LoadingErrorEmptyWrapper loading={loading && coins.length === 0} error={error} isEmpty={coins.length === 0}>
        <FlatList
          className="flex-1 px-4 bg-white"
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
    </>
  );
}
