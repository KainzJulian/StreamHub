// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...storybook.configs["flat/recommended"],
  ...storybook.configs["flat/recommended"]
];