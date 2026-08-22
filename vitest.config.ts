import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.tsx",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test-site-key",
    },
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "**/node_modules/**", ".claude/worktrees/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["**/*.{ts,tsx}"],
      exclude: [
        "e2e/**",
        "out/**",
        "scripts/**",
        "mdx-components.tsx",
        "**/*.config.*",
        "**/*.d.ts",
        "**/node_modules/**",
        ".next/**",
        ".claude/worktrees/**",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
