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
    "plugin:@beequeue/prettier",
  ],
  globals: {
    defineProps: "readonly",
    defineEmit: "readonly",
  },
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
  },
}
