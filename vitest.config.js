import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["app.js", "compare.js", "mistral.js", "anthropic.js", "data/*.js"],
      thresholds: { statements: 90, branches: 80, functions: 95, lines: 90 }
    }
  }
});
