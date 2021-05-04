module.exports = {
  env: {
    es2021: true,
    node: true,
  },
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
    "@typescript-eslint/no-non-null-assertion": "off",
    "import/no-extraneous-dependencies": [
      "off",
      {
        devDependencies: ["**/*"],
      },
    ],
  },
}
