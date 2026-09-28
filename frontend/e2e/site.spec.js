/**
 * The site as a visitor meets it: the production build under /personal-site/,
 * reading the real API cross-origin.
 */
import { expect, test } from './fixtures'
import { expectNoHorizontalScroll, visit } from './helpers'

test('the home page lists the projects and reports the API online', async ({ page }) => {
  await visit(page)

  await expect(page.getByRole('heading', { level: 1, name: 'Jacob Simerly', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /^Example project/ })).toBeVisible()
  await expect(page.getByText('API online', { exact: true })).toBeVisible()
  await expectNoHorizontalScroll(page)
})

test('opening a project loads its data from the API', async ({ page }) => {
  await visit(page)
  await page.getByRole('link', { name: /^Example project/ }).click()

  await expect(page).toHaveURL(/\/personal-site\/projects\/example$/)
  await expect(page.getByRole('listitem')).toHaveText(['First item', 'Second item', 'Third item'])
  await expectNoHorizontalScroll(page)
})

test('a project address works when opened directly and survives a reload', async ({ page }) => {
  await visit(page, 'projects/example')
  await expect(page.getByText('Third item', { exact: true })).toBeVisible()

  await page.reload()
  await expect(page.getByText('Third item', { exact: true })).toBeVisible()
})

test('the name in the header leads back home', async ({ page }) => {
  await visit(page, 'projects/example')
  await page.getByRole('link', { name: 'Jacob Simerly', exact: true }).click()

  await expect(page).toHaveURL(/\/personal-site\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Jacob Simerly', exact: true })).toBeVisible()
})

test('an unknown address shows the not-found page with a way home', async ({ page }) => {
  await visit(page, 'no-such-page')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()

  await page.getByRole('link', { name: 'Back to the home page' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Jacob Simerly', exact: true })).toBeVisible()
})
