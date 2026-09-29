/**
 * Cloud Run scales to zero, so the site has to behave while the API is slow
 * to wake or not answering at all. Only the network is delayed or cut here;
 * every response that does arrive comes from the real API.
 */
import { expect, test } from './fixtures'
import { cutApi, delayApi, visit } from './helpers'

test.describe('while the API is waking up', () => {
  test('a project page explains the wait, then shows the data', async ({ page }) => {
    await delayApi(page, 4_000)
    await visit(page, 'projects/example')

    await expect(page.getByText(/^Waking up the server/)).toBeVisible()
    await expect(page.getByText('First item', { exact: true })).toBeVisible({ timeout: 10_000 })
  })

  test('the home page renders without waiting on it', async ({ page }) => {
    await delayApi(page, 5_000)
    const health = page.waitForResponse('**/api/health/', { timeout: 10_000 })
    await visit(page)

    // The whole page is on screen while the wake-up ping is still out.
    await expect(page.getByRole('heading', { level: 1, name: 'Jacob Simerly', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'My journey' })).toBeVisible()
    // Let the held ping finish so nothing is in flight at teardown.
    expect((await health).status()).toBe(200)
  })
})

test.describe('when the API is down', () => {
  test.use({ allowedErrors: [/^Failed to load resource/] })

  test('the site still loads and says so plainly', async ({ page }) => {
    await cutApi(page)
    await visit(page, 'projects/example')

    await expect(page.getByRole('alert')).toHaveText("Couldn't load this. Try again in a moment.")
    await expect(page.getByRole('heading', { name: 'Example project' })).toBeVisible()
  })
})
