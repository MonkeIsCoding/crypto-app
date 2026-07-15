import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getThemePreference, setThemePreference } from "../services/preferences/themePreference";

interface ThemeContextValue {
  isDarkMode: boolean;
  isReady: boolean;
  toggleDarkMode: (enabled: boolean) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getThemePreference().then((scheme) => {
      setIsDarkMode(scheme === "dark");
      setIsReady(true);
    });
  }, []);

  const toggleDarkMode = useCallback(async (enabled: boolean) => {
    setIsDarkMode(enabled);
    await setThemePreference(enabled ? "dark" : "light");
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, isReady, toggleDarkMode }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
