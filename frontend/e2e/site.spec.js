/**
 * The site as a visitor meets it: the production build at the site root,
 * reading the real API cross-origin.
 */
import { expect, test } from './fixtures'
import { expectNoHorizontalScroll, visit } from './helpers'

test('the home page introduces me and leads to my portfolio', async ({ page }) => {
  await visit(page)

  await expect(page.getByRole('heading', { level: 1, name: 'Jacob Simerly', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'My journey' })).toBeVisible()
  await expectNoHorizontalScroll(page)

  await page.getByRole('link', { name: 'See my portfolio' }).click()
  await expect(page).toHaveURL('/portfolio')
  await expect(page.getByRole('heading', { level: 1, name: 'Portfolio' })).toBeVisible()
})

test('a data-backed project page loads its data from the API', async ({ page }) => {
  await visit(page, 'projects/example')

  await expect(page.getByRole('main').getByRole('listitem')).toHaveText(['First item', 'Second item', 'Third item'])
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

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Jacob Simerly', exact: true })).toBeVisible()
})
