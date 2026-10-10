/**
 * The resume PDF: printed by the build from the site's own resume page, and
 * offered for download. The spec downloads it from the built site and reads
 * its text back, so what people get is what the page says, and nothing more.
 */
import { readFileSync } from 'node:fs'
import { expect, test } from './fixtures'
import { expectNoHorizontalScroll, visit } from './helpers'

// pdfjs-dist, loaded on demand: its legacy build runs in Node.
async function textOf(pdfPath) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const pdf = await getDocument({ data: new Uint8Array(readFileSync(pdfPath)) }).promise
  const pages = []
  for (let n = 1; n <= pdf.numPages; n++) {
    const content = await (await pdf.getPage(n)).getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }
  return { pages: pdf.numPages, text: pages.join('\n').replace(/\s+/g, ' ') }
}

test('the resume downloads as a PDF of the page itself, with no phone number, on two pages at most', async ({ page }, testInfo) => {
  await visit(page, 'resume')

  const downloading = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download resume' }).click()
  const download = await downloading
  expect(download.suggestedFilename()).toBe('Jacob Simerly - Resume.pdf')
  const saved = testInfo.outputPath('resume.pdf')
  await download.saveAs(saved)

  const { pages, text } = await textOf(saved)
  expect(pages).toBeLessThanOrEqual(2)
  expect(text).toContain('Jacob Simerly')
  expect(text).toContain('Senior Data Engineer · Indianapolis, IN')
  expect(text).toContain("Architected and launched Lilly's first GitHub-native CI/CD pipeline for Microsoft Fabric")
  expect(text).toContain('Ball State University')
  expect(text).toContain('github.com/jsimerly/fantasy-analysis')
  expect(text).not.toMatch(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/)
})

test('the print layout stands alone: light, one column, nothing of the site around it', async ({ page }) => {
  await visit(page, 'resume/print')

  await expect(page.getByRole('heading', { level: 1, name: 'Jacob Simerly' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0)
  await expect(page.getByRole('link')).toHaveCount(0)
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('main')).backgroundColor)).toBe('rgb(255, 255, 255)')
  await expectNoHorizontalScroll(page)
})
