/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#111318",
        muted: "#6B7280",
        hairline: "#E6E7EB",
        brand: {
          green: "#1E7A46",
          "green-light": "#E7F5EC",
          red: "#DC2626",
        },
        dark: {
          bg: "#0B0D12",
          ink: "#F3F4F6",
          muted: "#9CA3AF",
          hairline: "#2A2D34",
          "green-light": "#123322",
        },
      },
      fontFamily: {
        sans: ["Manrope_400Regular"],
        "sans-medium": ["Manrope_500Medium"],
        "sans-semibold": ["Manrope_600SemiBold"],
        "sans-bold": ["Manrope_700Bold"],
        "sans-extrabold": ["Manrope_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
