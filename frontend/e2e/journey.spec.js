/**
 * The home page's journey: the timeline and the skills basket riding down its
 * middle (desktop only; phones get the skill tray instead).
 */
import { expect, test } from './fixtures'
import { visit } from './helpers'

test.describe('the skills basket', () => {
  // A tall screen, where the first cards start out above the line that
  // collects their skills.
  test.use({ viewport: { width: 1920, height: 1200 } })

  test('holds only Curious until the reader scrolls, then starts collecting', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'The basket is the desktop layout; phones get the skill tray.')
    await visit(page)
    const basket = page.locator('[data-basket="desktop"] [data-basket-skill]')

    await expect(basket).toHaveText(['Curious'])
    // Still only Curious a moment later, once the page has measured itself.
    await page.waitForTimeout(500)
    await expect(basket).toHaveText(['Curious'])

    await page.evaluate(() => window.scrollBy(0, 1))

    await expect(basket.filter({ hasText: /^C\+\+$/ })).toHaveCount(1)
  })
})

test('lays the timeline out in order, with no cards overlapping and work beside personal projects', async ({ page }, testInfo) => {
  await visit(page)
  const laidOut = await page.evaluate(() =>
    [...document.querySelectorAll('[data-journey-entry]')].map((row) => {
      const card = row.children[1].getBoundingClientRect()
      return {
        title: row.querySelector('h3').textContent,
        top: row.getBoundingClientRect().top,
        left: Math.round(card.left),
        cardTop: card.top,
        cardBottom: card.bottom,
      }
    }),
  )
  const overlapping = laidOut.flatMap((a, i) =>
    laidOut
      .slice(i + 1)
      .filter((b) => a.left === b.left && a.cardTop < b.cardBottom - 1 && b.cardTop < a.cardBottom - 1)
      .map((b) => `${a.title} / ${b.title}`),
  )
  expect(overlapping).toEqual([])
  const outOfOrder = laidOut.slice(1).filter((card, i) => card.top < laidOut[i].top - 0.5).map((card) => card.title)
  expect(outOfOrder).toEqual([])

  if (testInfo.project.name === 'mobile') return
  // May 2022 at UKG sits beside April 2022's personal project, not below it.
  const rules = laidOut.find((card) => card.title === 'Rules of Engagement project')
  const sportsbook = laidOut.find((card) => card.title === 'Stuck in High School Sportsbook')
  expect(rules.left).not.toBe(sportsbook.left)
  expect(rules.cardTop).toBeLessThan(sportsbook.cardBottom)
})
