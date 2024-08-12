import antfu from "@antfu/eslint-config"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  antfu({
    ignores: ["**/*.json", "**/*.config.ts"],
    stylistic: false,
    test: { overrides: { "test/no-import-node-test": "off" } },
    vue: {
      overrides: {
        "vue/block-order": "off",
      },
    },
    typescript: {
      tsconfigPath: "./tsconfig.json",
      overrides: {
        "no-console": "off",

        "ts/no-use-before-define": "off",
        "ts/consistent-type-definitions": "off",
        "ts/no-unsafe-argument": "off",
        "ts/no-unsafe-assignment": "off",

        "node/prefer-global/process": "off",
      },
    },
  }),
)
