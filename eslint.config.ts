import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import stylistic from "@stylistic/eslint-plugin";
import pluginPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  pluginPrettier,
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/semi": ["warn", "always"],
      "@stylistic/quotes": ["warn", "double"],
      "@stylistic/max-len": ["warn", { code: 120 }],
      "unicorn/filename-case": ["error", { cases: { pascalCase: true, camelCase: true } }],
      "unicorn/prevent-abbreviations": [
        "error",
        {
          checkFilenames: false,
          ignore: ["[Pp]rops", /^ignore/i],
        },
      ],
    },
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/indent": ["warn", 2],
    },
    ignores: ["**/*.vue"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  eslintPluginUnicorn.configs.recommended,
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    rules: {
      "vue/script-indent": ["warn", 2, { baseIndent: 1 }],
    },
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ["./src/components/ui/**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },

  globalIgnores([".github/*", ".vscode/*", "node_modules/*"]),
]);
