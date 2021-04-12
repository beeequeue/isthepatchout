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
  overrides: [
    {
      files: ["api/**/*.ts"],
      extends: [
        "plugin:@beequeue/base",
        "plugin:@beequeue/node",
        "plugin:@beequeue/typescript",
        "plugin:@beequeue/prettier",
      ],
      parserOptions: {
        project: "api/tsconfig.json",
      },
      rules: {
        "import/no-extraneous-dependencies": [
          "off",
          {
            devDependencies: ["**/*"],
          },
        ],
      },
    },
  ],
}
