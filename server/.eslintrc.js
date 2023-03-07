const path = require("path")

/** @type import("eslint-define-config").ESLintConfig */
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
    "no-undef": "off",
    "no-console": "error",
    "unicorn/prefer-module": "off",
    "import/no-extraneous-dependencies": [
      "off",
      {
        devDependencies: ["**/*"],
      },
    ],
  },
}
