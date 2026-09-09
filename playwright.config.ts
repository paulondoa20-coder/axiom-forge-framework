import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? "http://localhost:8080",
    trace: "off",
    viewport: { width: 390, height: 844 },
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
        // Optional override when the sandbox ships its own Chromium build.
        launchOptions: process.env['E2E_CHROMIUM_PATH']
          ? { executablePath: process.env['E2E_CHROMIUM_PATH'] }
          : {},
      },
    },
  ],
});
