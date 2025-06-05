import { defineConfig } from "unocss"
import { colors } from "unocss/preset-wind3"

export default defineConfig({
  safelist: [
    "!animate-delay-250ms",
    "!animate-delay-500ms",
    "!animate-delay-750ms",
    "i-tabler:bell-off",
    "i-tabler:bell-filled",
  ],
  shortcuts: {
    "grayed-out": "filter brightness-50 grayscale-50 opacity-50",
  },
  theme: {
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
      serif: ["Radiance", "serif"],
    },
    screens: {
      sm: "768px",
      md: "1024px",
      lg: "1280px",
    },
    colors: {
      trans: "transparent",
      current: "currentColor",
      gray: colors.stone,
      danger: colors.rose,
      primary: colors.amber,
    },
  },
})
