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
        "vue/html-self-closing": "off",
        "vue/singleline-html-element-content-newline": "off",
      },
    },
    typescript: {
      tsconfigPath: "./tsconfig.json",
      overrides: {
        "no-console": "off",

        "ts/no-use-before-define": "off",
        "ts/consistent-type-definitions": "off",
        "ts/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
        "ts/no-unsafe-argument": "off",
        "ts/no-unsafe-assignment": "off",

        "node/prefer-global/process": "off",
        "antfu/no-top-level-await": "off",

        "perfectionist/sort-imports": [
          "error",
          {
            type: "natural",
            internalPattern: ["^@/.+?", "^~+/.+?", "^#[a-z]+/.+?"],
            newlinesBetween: "always",
            groups: [
              ["builtin", "builtin-type"],
              ["external", "external-type"],
              ["internal", "internal-type"],
              ["parent", "parent-type"],
              ["sibling", "sibling-type"],
              ["index", "index-type"],
              "object",
              "unknown",
            ],
          },
        ],
      },
    },
  }),
)
