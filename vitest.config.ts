import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.tsx",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "**/node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "e2e/**",
        "content/**",
        "out/**",
        "scripts/**",
        "mdx-components.tsx",
        "**/*.config.*",
        "**/*.d.ts",
        "**/node_modules/**",
        ".next/**",
      ],
      thresholds: {
        lines: 96,
        functions: 95,
        branches: 92,
        statements: 96,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
