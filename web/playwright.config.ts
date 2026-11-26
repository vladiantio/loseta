import { defineConfig, devices } from "@playwright/test";

// The docs suite asserts DOM, copy and accessibility contracts that do not
// depend on the engine, so it runs once in Chromium. Behavior modules still
// run in every browser. Set PW_FULL_WEBKIT=1 to repeat the whole suite in
// WebKit when touching Safari-specific CSS.
const fullWebKit = process.env.PW_FULL_WEBKIT === "1";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4323",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /behaviors\/no-js\.spec\.ts/
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: fullWebKit ? /.*\.spec\.ts/ : /behaviors\/.*\.spec\.ts/,
      testIgnore: /behaviors\/no-js\.spec\.ts/
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /behaviors\/.*\.spec\.ts/,
      testIgnore: /behaviors\/no-js\.spec\.ts/
    },
    {
      name: "no-js",
      use: { ...devices["Desktop Chrome"], javaScriptEnabled: false },
      testMatch: /behaviors\/no-js\.spec\.ts/
    }
  ],
  webServer: {
    // Astro auto-backgrounds preview when it detects an agent; --ignore-lock keeps
    // it in the foreground so Playwright can manage the process.
    command: "pnpm exec astro preview --port 4323 --ignore-lock",
    url: "http://localhost:4323",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
