import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves a project repo under /<repo>/. The Pages workflow passes
// that prefix in as BASE_PATH (empty for a custom domain); local dev uses "/".
const base = `${process.env.BASE_PATH ?? ''}/`

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
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
    // Unit and component tests only. e2e/ belongs to Playwright.
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
      // CI fails below these. Raise them as the suite grows; never lower them to go green.
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 85 },
    },
  },
})
