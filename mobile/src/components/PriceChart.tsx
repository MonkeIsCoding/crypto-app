import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface Props {
  labels: string[];
  prices: number[];
  isPositive?: boolean;
}

export function PriceChart({ labels, prices, isPositive = true }: Props) {
  if (prices.length === 0) return null;

  const lineColor = isPositive ? "30, 122, 70" : "220, 38, 38";

  return (
    <View className="py-2">
      <LineChart
        data={{ labels, datasets: [{ data: prices }] }}
        width={Dimensions.get("window").width - 32}
        height={200}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={false}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(${lineColor}, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          fillShadowGradientFrom: `rgb(${lineColor})`,
          fillShadowGradientFromOpacity: 0.15,
          fillShadowGradientTo: `rgb(${lineColor})`,
          fillShadowGradientToOpacity: 0,
          propsForBackgroundLines: { stroke: "transparent" },
        }}
        bezier
        style={{ borderRadius: 8, marginLeft: -16 }}
      />
    </View>
  );
}
