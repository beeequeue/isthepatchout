/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite-plugin-windicss"
import colors from "windicss/colors"
import { PluginUtils } from "windicss/types/interfaces"

// @ts-ignore: Missing types
import Animations from "@windicss/plugin-animations"

const plugin = ({ addDynamic }: PluginUtils) => {
  addDynamic("animate-delay", ({ Utility }) =>
    Utility.handler.handleTime().createProperty("animation-delay"),
  )
}

export default defineConfig({
  safelist: ["!animate-delay-250ms", "!animate-delay-500ms", "!animate-delay-750ms"],
  corePlugins: {
    accessibility: false,
  },
  plugins: [Animations(), plugin],
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
        gray: colors.stone,
        danger: colors.rose,
        primary: colors.amber,
      },
    },
  },
})
