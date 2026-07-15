import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useThemeColors } from "../theme/colors";

interface Props {
  labels: string[];
  prices: number[];
  isPositive?: boolean;
}

function buildAxisFormatter(prices: number[]): (value: string) => string {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const useK = Math.max(Math.abs(min), Math.abs(max)) >= 1000;
  const toDisplay = (num: number, decimals: number) =>
    useK ? `${(num / 1000).toFixed(decimals)}k` : num.toFixed(decimals);

  let decimals = useK ? 0 : 2;
  if (min !== max) {
    const labelValues = Array.from({ length: 5 }, (_, i) => min + ((max - min) / 4) * i);
    const maxDecimals = useK ? 3 : 4;
    for (let d = useK ? 0 : 2; d <= maxDecimals; d++) {
      decimals = d;
      const rendered = labelValues.map((value) => toDisplay(value, d));
      if (new Set(rendered).size === rendered.length) break;
    }
  }

  return (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? toDisplay(num, decimals) : value;
  };
}

export function PriceChart({ labels, prices, isPositive = true }: Props) {
  const colors = useThemeColors();

  if (prices.length === 0) return null;

  const lineColor = isPositive ? "16, 185, 129" : "239, 68, 68";
  const backgroundColor = colors.background;
  const labelColor = colors.muted === "#9CA3AF" ? "156, 163, 175" : "107, 114, 128";
  const formatAxisLabel = buildAxisFormatter(prices);

  return (
    <View className="py-2">
      <LineChart
        data={{ labels, datasets: [{ data: prices, color: () => `rgb(${lineColor})`, strokeWidth: 3 }] }}
        width={Dimensions.get("window").width - 32}
        height={200}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={false}
        formatYLabel={formatAxisLabel}
        chartConfig={{
          backgroundColor,
          backgroundGradientFrom: backgroundColor,
          backgroundGradientTo: backgroundColor,
          decimalPlaces: 6,
          color: (opacity = 1) => `rgba(${lineColor}, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(${labelColor}, ${opacity})`,
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
