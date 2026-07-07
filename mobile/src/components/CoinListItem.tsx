import React from "react";
import { Pressable, Text, View } from "react-native";
import { Coin } from "../domain/models/Coin";

interface Props {
  coin: Coin;
  onPress: (coinId: string) => void;
}

export function CoinListItem({ coin, onPress }: Props) {
  const isPositive = coin.price_change_24h >= 0;

  return (
    <Pressable
      className="flex-row justify-between items-center py-3 px-4 border-b border-[#ddd]"
      onPress={() => onPress(coin.coin_id)}
    >
      <View className="shrink">
        <Text className="font-semibold text-base">{coin.symbol.toUpperCase()}</Text>
        <Text className="text-[#666] text-[13px]">{coin.name}</Text>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-base">${coin.price.toLocaleString()}</Text>
        <Text className={`text-[13px] ${isPositive ? "text-[#2e7d32]" : "text-[#c0392b]"}`}>
          {isPositive ? "+" : ""}
          {coin.price_change_24h.toFixed(2)}%
        </Text>
      </View>
    </Pressable>
  );
}
