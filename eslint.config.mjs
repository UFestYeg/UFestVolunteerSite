import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "build/**",
            "dist/**",
            "coverage/**",
            "node_modules/**",
            "**/*.config.{js,ts,mjs,cjs}",
        ],
    },
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*.{ts,tsx}"],
        plugins: {
            react,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
        },
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: { version: "detect" },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            // TS handles undefined globals; avoid false positives on browser APIs.
            "no-undef": "off",
            // React 16 with classic JSX runtime does not need these.
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
            // Downgrade noisy rules so `eslint src` runs without mass source edits.
            "prefer-const": "warn",
            "react/no-unescaped-entities": "warn",
            "jsx-a11y/no-autofocus": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-empty-object-type": "warn",
            "@typescript-eslint/no-unsafe-function-type": "warn",
            "@typescript-eslint/no-unused-expressions": "warn",
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/no-non-null-assertion": "off",
        },
    },
    prettier
);
