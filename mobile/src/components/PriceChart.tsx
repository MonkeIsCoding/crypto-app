import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface Props {
  labels: string[];
  prices: number[];
}

export function PriceChart({ labels, prices }: Props) {
  if (prices.length === 0) return null;

  return (
    <View className="py-2">
      <LineChart
        data={{ labels, datasets: [{ data: prices }] }}
        width={Dimensions.get("window").width - 32}
        height={220}
        withDots={false}
        withInnerLines={false}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(46, 91, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
        }}
        bezier
        style={{ borderRadius: 8 }}
      />
    </View>
  );
}
