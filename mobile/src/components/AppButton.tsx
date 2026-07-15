import React from "react";
import { Pressable, Text } from "react-native";
import { useThemeClasses } from "../theme/classes";

type Variant = "solid" | "outline" | "green-outline" | "danger-outline";

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  large?: boolean;
  busy?: boolean;
  busyLabel?: string;
  className?: string;
}

export function AppButton({
  label,
  onPress,
  variant = "solid",
  large = false,
  busy = false,
  busyLabel,
  className = "",
}: Props) {
  const { bg, hairline, inkText } = useThemeClasses();

  const containerByVariant: Record<Variant, string> = {
    solid: "bg-brand-green",
    outline: `border ${hairline} ${bg}`,
    "green-outline": `border border-brand-green ${bg}`,
    "danger-outline": `border border-brand-red ${bg}`,
  };
  const textByVariant: Record<Variant, string> = {
    solid: "text-white",
    outline: inkText,
    "green-outline": "text-brand-green",
    "danger-outline": "text-brand-red",
  };

  return (
    <Pressable
      className={`${large ? "rounded-2xl p-4" : "rounded-xl p-3.5"} items-center ${containerByVariant[variant]} ${className}`}
      onPress={onPress}
      disabled={busy}
    >
      <Text className={`font-sans-semibold text-[15px] ${textByVariant[variant]}`}>
        {busy && busyLabel ? busyLabel : label}
      </Text>
    </Pressable>
  );
}
