/* eslint-disable no-undef,import/no-extraneous-dependencies */
import { defineConfig } from "vite-plugin-windicss"
// @ts-ignore: Missing types
import Animations from "@windicss/animations"

import colors from "windicss/colors"

export default defineConfig({
  mode: "jit",
  darkMode: false,
  corePlugins: {
    accessibility: false,
  },
  plugins: [Animations()],
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
    extend: {
      colors: {
        trans: "transparent",
        current: "currentColor",
        gray: colors.warmGray,
        danger: colors.rose,
        primary: colors.amber,
      },
    },
  },
})
