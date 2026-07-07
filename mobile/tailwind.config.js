/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
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
