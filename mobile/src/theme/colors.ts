import { useTheme } from "../context/ThemeContext";

interface ThemeColors {
  background: string;
  ink: string;
  muted: string;
  hairline: string;
  brandGreen: string;
  brandGreenLight: string;
  brandRed: string;
}

const lightColors: ThemeColors = {
  background: "#FFFFFF",
  ink: "#111318",
  muted: "#6B7280",
  hairline: "#E6E7EB",
  brandGreen: "#1E7A46",
  brandGreenLight: "#E7F5EC",
  brandRed: "#DC2626",
};

const darkColors: ThemeColors = {
  background: "#0B0D12",
  ink: "#F3F4F6",
  muted: "#9CA3AF",
  hairline: "#2A2D34",
  brandGreen: "#1E7A46",
  brandGreenLight: "#123322",
  brandRed: "#DC2626",
};

export function useThemeColors(): ThemeColors {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkColors : lightColors;
}
