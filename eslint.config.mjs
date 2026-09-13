import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "scripts/**",
    "next-env.d.ts",
    // Playwright run artifacts are gitignored bundles; linting them after a pinned run
    // produced thousands of findings against generated code.
    "playwright-report/**",
    "test-results/**",
    ".playwright-mcp/**",
  ]),
]);

export default eslintConfig;
