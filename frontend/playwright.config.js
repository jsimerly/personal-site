/**
 * The E2E lane: real Chromium against the real stack, no API mocks.
 *
 * Prod-shaped on purpose. Vite builds the site the way GitHub Pages serves it
 * (under /personal-site/, calling the API cross-origin) and `vite preview`
 * serves that build. Django runs api.settings.e2e: DEBUG off, JSON only, CORS
 * open to exactly this origin. A base-path or CORS mistake fails here first.
 *
 * Playwright boots and owns both servers, so `npm run e2e` is the whole
 * ceremony. Every spec runs on a phone and on a laptop.
 */
import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const API_DIR = path.resolve(HERE, '..', 'api')
// The api/ venv by default; CI points this at setup-python's interpreter.
const API_PYTHON =
  process.env.E2E_API_PYTHON ??
  path.join(API_DIR, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')

const SITE = 'http://127.0.0.1:5175'
const API = 'http://127.0.0.1:8001'
const BASE_PATH = '/personal-site'

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // No retries: a flaky test gets investigated, not rerun until it passes.
  retries: 0,
  reporter: process.env.CI ? [['list'], ['github']] : [['list']],
  use: {
    // Trailing slash matters: specs navigate with relative paths (see helpers.js).
    baseURL: `${SITE}${BASE_PATH}/`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  // Always fresh servers: reusing one could test a stale build.
  webServer: [
    {
      command: `"${API_PYTHON}" manage.py runserver 127.0.0.1:8001 --noreload`,
      cwd: API_DIR,
      env: { DJANGO_SETTINGS_MODULE: 'api.settings.e2e' },
      url: `${API}/api/health/`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command:
        'npx vite build --outDir .e2e-dist && npx vite preview --outDir .e2e-dist --host 127.0.0.1 --port 5175 --strictPort',
      cwd: HERE,
      env: { BASE_PATH, VITE_API_BASE_URL: API },
      url: `${SITE}${BASE_PATH}/`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})
