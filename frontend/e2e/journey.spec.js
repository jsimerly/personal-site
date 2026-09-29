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
