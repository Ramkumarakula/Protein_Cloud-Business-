import { defineConfig, devices } from "@playwright/test";

// Tests run against the static export in out/ (run `pnpm build` first).
// BASE_PATH lets the same suite verify a GitHub Pages project-repo build, e.g. /meal-plans.
const port = Number(process.env.PORT ?? 4173);
const basePath = process.env.BASE_PATH ?? "";

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath}/`,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `pnpm exec serve ${basePath ? ".pages-preview" : "out"} -l ${port} --no-clipboard`,
    url: `http://127.0.0.1:${port}${basePath}/`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
