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
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
  },
  rules: {
    "@typescript-eslint/naming-convention": "off",
    "vue/multi-word-component-names": "off",
  },
}
