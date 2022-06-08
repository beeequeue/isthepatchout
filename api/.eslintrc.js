const { join } = require("path")

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
    project: join(__dirname, "tsconfig.json"),
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
