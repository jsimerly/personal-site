// Prints the resume to the PDF the Resume page offers for download.
//
//   node scripts/build-resume-pdf.mjs <outDir> [url]
//
// Serves the built site in <outDir> (or uses a running one at `url`), opens
// its print layout at /resume/print in Chromium, and writes
// <outDir>/<profile.resumePdf>. The deploy runs it on the built site, so the
// PDF is made from the same content as the page, every time. For a dev
// server: node scripts/build-resume-pdf.mjs public http://localhost:5173
import { mkdir, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { preview } from 'vite'
import { profile } from '../src/content/profile.js'

const [outDir = 'dist', givenUrl] = process.argv.slice(2)
if (!profile.resumePdf) {
  console.error('profile.resumePdf names no file, so there is nothing to print.')
  process.exit(1)
}

let server
let url = givenUrl
if (!url) {
  server = await preview({ build: { outDir }, preview: { host: '127.0.0.1', port: 4178, strictPort: true }, logLevel: 'error' })
  url = server.resolvedUrls.local[0]
}

const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.goto(new URL('resume/print', url.endsWith('/') ? url : `${url}/`).href, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.evaluate(() => document.fonts.ready)
  await mkdir(resolve(outDir), { recursive: true })
  const path = resolve(outDir, profile.resumePdf)
  await page.pdf({
    path,
    format: 'Letter',
    margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
    printBackground: true,
  })
  console.log(`wrote ${path} (${Math.round((await stat(path)).size / 1024)} KB)`)
} finally {
  await browser.close()
  await server?.close()
}
