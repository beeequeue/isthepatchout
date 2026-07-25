import antfu from "@antfu/eslint-config"

export default antfu({
  ignores: ["**/*.json"],
  markdown: false,
  stylistic: false,
  jsonc: false,
  jsx: false,
  pnpm: false,
  toml: false,
  svelte: {
    overrides: {
      "antfu/no-top-level-await": "off",
      "perfectionist/sort-imports": "off",
    },
  },
  typescript: {
    tsconfigPath: "tsconfig.json",
    ignoresTypeAware: ["copy.ts", "*.config.*"],

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

      "perfectionist/sort-imports": "off",
    },
  },
})
