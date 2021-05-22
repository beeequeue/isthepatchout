/* eslint-disable no-undef,import/no-extraneous-dependencies */
const { defineConfig } = require("vite-plugin-windicss")
const colors = require("windicss/colors")

export default defineConfig({
  mode: "jit",
  darkMode: false,
  corePlugins: {
    accessibility: false,
  },
  plugins: [],
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
      gray: colors.warmGray,
      danger: colors.rose,
      primary: colors.amber,
    },
  },
})
