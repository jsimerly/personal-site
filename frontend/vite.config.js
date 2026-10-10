import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import resumePdfHint from './scripts/resume-pdf-hint.mjs'
import { profile } from './src/content/profile.js'

// GitHub Pages serves a project repo under /<repo>/. The Pages workflow passes
// that prefix in as BASE_PATH (empty for a custom domain); local dev uses "/".
const base = `${process.env.BASE_PATH ?? ''}/`

// https://vite.dev/config/
export default defineConfig({
  base,
  // The resume PDF is printed by the build; in dev, a missing one gets a
  // plain 404 that says how to print it, not the app's HTML.
  plugins: [react(), tailwindcss(), resumePdfHint(profile.resumePdf)],
  server: {
    // In dev the app calls relative /api/... paths and Vite forwards them to
    // the local Django server, so no CORS setup is needed.
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // Unit and component tests only (the build scripts' tests included).
    // e2e/ belongs to Playwright.
    include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
      // CI fails below these. Raise them as the suite grows; never lower them to go green.
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 85 },
    },
  },
})
