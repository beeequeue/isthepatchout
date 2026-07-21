import antfu from "@antfu/eslint-config"

import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  antfu({
    ignores: ["**/*.json", "**/*.config.ts", "**/request-logger.ts"],
    stylistic: false,
    vue: {
      overrides: {
        "vue/block-order": "off",
        "vue/html-self-closing": "off",
        "vue/singleline-html-element-content-newline": "off",
      },
    },
    typescript: {
      overrides: {
        "no-console": "off",
        "antfu/no-top-level-await": "off",
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "node/prefer-global/process": "off",
        "ts/consistent-type-definitions": "off",
        "ts/consistent-type-imports": [
          "error",
          { fixStyle: "inline-type-imports", disallowTypeAnnotations: false },
        ],
        "ts/no-unsafe-argument": "off",
        "ts/no-unsafe-assignment": "off",
        "ts/no-use-before-define": "off",
        "unicorn/number-literal-case": "off",
        "unused-imports/no-unused-vars": "off",

        "perfectionist/sort-imports": [
          "error",
          {
            type: "natural",
            internalPattern: ["^[@~#]+/"],
            newlinesBetween: 1,
            groups: ["builtin", "external", "internal", "parent", "sibling", "index", "unknown"],
          },
        ],
      },
    },
  }),
)
