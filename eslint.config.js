import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      "svelte/no-navigation-without-resolve": "off",
      "svelte/no-dom-manipulating": "off",
      "svelte/require-each-key": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: [
      "build/",
      ".svelte-kit/",
      "dist/",
      ".gemini/",
      ".agents/",
      ".Jules/",
      ".impeccable/",
      ".vite-hooks/",
      ".vscode/",
      "node_modules/",
    ],
  },
];
