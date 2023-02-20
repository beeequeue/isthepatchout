module.exports = {
  root: true,
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
    "unicorn/prefer-module": "off",
    "@typescript-eslint/naming-convention": "off",
    "vue/multi-word-component-names": "off",
  },
}
