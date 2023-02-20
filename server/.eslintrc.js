/* eslint-disable unicorn/prefer-module */
const path = require("path")

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:@beequeue/base",
    "plugin:@beequeue/node",
    "plugin:@beequeue/typescript",
  ],
  parserOptions: {
    project: path.resolve(__dirname, "../tsconfig.json"),
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "off",
      {
        devDependencies: ["**/*"],
      },
    ],
  },
}
