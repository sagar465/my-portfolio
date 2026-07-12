import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the portfolio refresh + AIgentLoop flagship.
 *
 * Port note (architecture §6.2, D-006): this project's Vite dev server runs on
 * :3000 (vite.config.ts), NOT the rubric-default :5173. baseURL + webServer use
 * :3000 so QA's real-path pass hits the app the local dev server actually serves.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  // The flagship is a self-playing, looping cinematic (D-009): a full pass through
  // six agents + the human gate + the revise beat, on a cold homepage where its
  // chunk lazy-loads behind the other sections. The cadence was deliberately slowed
  // (D-012 — "give the user time to grab details"), so a full pass is now ~35s of
  // wall-clock. Give each test generous headroom so a full-run assertion is
  // deterministic on slower CI machines.
  timeout: 90_000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
