import { useTheme } from "../context/ThemeContext";

interface ThemeClasses {
  bg: string;
  hairline: string;
  pillBg: string;
  inkText: string;
  mutedText: string;
  greenLightBg: string;
  banner: string;
}

const lightClasses: ThemeClasses = {
  bg: "bg-white",
  hairline: "border-hairline",
  pillBg: "bg-hairline",
  inkText: "text-ink",
  mutedText: "text-muted",
  greenLightBg: "bg-brand-green-light",
  banner: "bg-amber-100 text-amber-800",
};

const darkClasses: ThemeClasses = {
  bg: "bg-dark-bg",
  hairline: "border-dark-hairline",
  pillBg: "bg-dark-hairline",
  inkText: "text-dark-ink",
  mutedText: "text-dark-muted",
  greenLightBg: "bg-dark-green-light",
  banner: "bg-amber-900 text-amber-200",
};

export function useThemeClasses(): ThemeClasses {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkClasses : lightClasses;
}
