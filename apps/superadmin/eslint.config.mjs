import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Ambient env contracts share global type augmentation across the monorepo
    // via `/// <reference path>`. The import-style alternative does not apply to
    // `declare namespace NodeJS` in a global script file.
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": [
        "error",
        { path: "always", types: "prefer-import", lib: "always" },
      ],
    },
  },
]);

export default eslintConfig;
