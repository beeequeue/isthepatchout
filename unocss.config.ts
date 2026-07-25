import extractorSvelte from "@unocss/extractor-svelte"
import presetIcons from "@unocss/preset-icons"
import presetWebFonts from "@unocss/preset-web-fonts"
import presetWind3 from "@unocss/preset-wind3"
import transformerCompileClass from "@unocss/transformer-compile-class"
import transformerDirectives from "@unocss/transformer-directives"
import type { VitePluginConfig } from "@unocss/vite"

export default {
  presets: [
    presetWind3(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetWebFonts({
      fonts: {
        serif: { name: "Radiance", provider: "none" },
        sans: {
          name: "Averia Libre",
          subsets: ["latin"],
          weights: [400],
        },
      },
    }),
  ],
  extractors: [extractorSvelte()],
  transformers: [
    transformerDirectives(),
    transformerCompileClass({
      alwaysHash: true,
      classPrefix: "u-",
    }),
  ],
  shortcuts: {
    "grayed-out": "filter brightness-50 grayscale-50 opacity-85",
    disabled: "grayed-out pointer-events-none",
    "flex-center": "flex justify-center items-center",
    "flex-col": "flex flex-col",
    "flex-col-center": "flex flex-col justify-center items-center",
  },
  theme: {
    colors: {
      trans: "transparent",
      current: "currentColor",
    },
  },
} satisfies VitePluginConfig
