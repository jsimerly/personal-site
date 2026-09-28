/**
 * Shared E2E steps.
 *
 * Navigation goes through visit(), which resolves paths against the baseURL,
 * so the specs work whether the site sits at a domain root or under a path.
 */
import { expect } from './fixtures'

export async function visit(page, path = '') {
  await page.goto(path.replace(/^\//, ''))
}

/** Mobile-first guard: nothing may push the page wider than the screen. */
export async function expectNoHorizontalScroll(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, 'the page is wider than the viewport').toBeLessThanOrEqual(0)
}

/** Holds every API response for `ms`, acting out a Cloud Run cold start. The real API still answers. */
export async function delayApi(page, ms) {
  await page.route('**/api/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, ms))
    await route.continue()
  })
}

/** Fails every API request at the network level, as if the service were down. */
export async function cutApi(page) {
  await page.route('**/api/**', (route) => route.abort())
}
