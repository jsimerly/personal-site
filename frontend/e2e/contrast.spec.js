/**
 * Every piece of text on the site meets the WCAG AA contrast minimum (4.5:1,
 * or 3:1 for large text), measured by axe-core in a real browser against the
 * colors that actually render, dark surfaces and all.
 */
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from './fixtures'
import { visit } from './helpers'

// Each page, and what to wait for so its data has rendered before measuring.
const PAGES = [
  ['the home page', '', (page) => page.getByRole('region', { name: 'Selected work' })],
  ['the portfolio', 'portfolio', (page) => page.getByRole('tabpanel')],
  ['the fantasy portfolio tab', 'portfolio?tab=fantasy-football', (page) => page.getByRole('list', { name: 'Top players' })],
  ['a coming-soon portfolio tab', 'portfolio?tab=agentic-investing', (page) => page.getByRole('tabpanel')],
  ['the projects gallery', 'projects', (page) => page.getByRole('group', { name: 'Filter projects' })],
  ['a project page', 'projects/lilly-fabric-cicd', (page) => page.getByRole('heading', { level: 1 })],
  ['the resume', 'resume', (page) => page.getByRole('heading', { level: 1 })],
  ['the about page', 'about', (page) => page.getByRole('heading', { level: 1 })],
  ['the fantasy player values', 'fantasy-analysis', (page) => page.getByRole('table', { name: 'Player values' })],
  ['the fantasy model performance', 'fantasy-analysis/model', (page) => page.getByRole('group', { name: 'Rest of season' })],
]

// "target: ratio (foreground on background)" for each failure, so a red run
// says exactly what to fix.
async function lowContrast(page) {
  const { violations } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
  return violations.flatMap((violation) =>
    violation.nodes.map((node) => {
      const data = node.any[0]?.data ?? {}
      return `${node.target.join(' ')}: ${data.contrastRatio}:1 (${data.fgColor} on ${data.bgColor})`
    }),
  )
}

for (const [name, path, ready] of PAGES) {
  test(`all text on ${name} meets the AA contrast minimum`, async ({ page }) => {
    await visit(page, path)
    await expect(ready(page)).toBeVisible()

    expect(await lowContrast(page)).toEqual([])
  })
}

test('all text on the home page meets the AA contrast minimum once the whole journey has been scrolled', async ({ page }) => {
  await visit(page)
  // Through the journey a screen at a time, so every card reveals and the
  // skills sort, then let the last transitions finish.
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 600) await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(page.getByRole('heading', { name: 'Want to build something together?' })).toBeInViewport()
  await page.waitForTimeout(800)

  expect(await lowContrast(page)).toEqual([])
})
