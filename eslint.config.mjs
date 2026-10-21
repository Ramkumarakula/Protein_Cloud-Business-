import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "react/no-danger": "error",
      // Static export with pre-generated WebP srcsets; next/image optimisation is off anyway.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
