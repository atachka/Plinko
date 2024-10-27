const eslintPluginPrettier = require("eslint-plugin-prettier");
const eslintPluginTypescript = require("@typescript-eslint/eslint-plugin");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": eslintPluginTypescript,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      ...eslintPluginTypescript.configs.recommended.rules,
      "prettier/prettier": ["error", { singleQuote: false }],
      quotes: ["error", "double"],
    },
  },
];
