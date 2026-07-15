import React from "react";
import { Pressable, Text, View } from "react-native";
import { Coin } from "../models/Coin";
import { useThemeClasses } from "../theme/classes";

interface Props {
  coin: Coin;
  onPress: (coinId: string) => void;
}

export const CoinListItem = React.memo(function CoinListItem({ coin, onPress }: Props) {
  const { bg, hairline, inkText, mutedText } = useThemeClasses();
  const isPositive = coin.price_change_24h >= 0;

  return (
    <Pressable
      className={`flex-row justify-between items-center py-4 ${bg} border-x-0 border-t-0 border-b ${hairline}`}
      onPress={() => onPress(coin.coin_id)}
    >
      <View className="shrink">
        <Text className={`font-sans-bold text-[15px] ${inkText}`}>{coin.symbol.toUpperCase()}</Text>
        <Text className={`font-sans text-[13px] ${mutedText} mt-0.5`}>{coin.name}</Text>
      </View>
      <View className="items-end">
        <Text className={`font-sans-semibold text-[15px] ${inkText} tabular-nums`}>
          ${coin.price.toLocaleString()}
        </Text>
        <Text
          className={`font-sans-medium text-[13px] mt-0.5 tabular-nums ${isPositive ? "text-brand-green" : "text-brand-red"}`}
        >
          {isPositive ? "+" : ""}
          {coin.price_change_24h.toFixed(2)}%
        </Text>
      </View>
    </Pressable>
  );
});
