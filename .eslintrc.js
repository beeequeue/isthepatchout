/** @type import("eslint-define-config").ESLintConfig */
module.exports = {
  root: true,
  ignorePatterns: ["node_modules", ".output", ".nuxt", "windi.config.ts"],
  env: {
    es2021: true,
    browser: true,
  },
  extends: [
    "plugin:@beequeue/base",
    "plugin:@beequeue/vue",
    "plugin:@beequeue/typescript",
  ],
  rules: {
    "no-undef": "off",
    "no-console": "error",
    "unicorn/prefer-module": "off",
    "@typescript-eslint/naming-convention": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-undef-components": "off",
  },
}
