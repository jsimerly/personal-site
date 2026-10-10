/**
 * The site as a visitor meets it: the production build at the site root,
 * reading the real API cross-origin.
 */
import { expect, test } from './fixtures'
import { expectNoHorizontalScroll, visit } from './helpers'

// The ten-second test: on a phone and a laptop alike, the first screen says
// what I do and offers a way to reach me, before any scrolling.
test('the first screen says what I do and how to reach me, before any scrolling', async ({ page }) => {
  await visit(page)

  const { height } = page.viewportSize()
  for (const [name, element] of [
    ['my name', page.getByRole('heading', { level: 1, name: 'Jacob Simerly', exact: true })],
    ['what I do', page.getByText('I build Microsoft Fabric data platforms that hold up to audit, and lead the teams that run them.')],
    ['the contact button', page.getByRole('button', { name: 'Work with me' })],
    ['the resume button', page.getByRole('main').getByRole('link', { name: 'Resume', exact: true })],
  ]) {
    const box = await element.boundingBox()
    expect(box.y + box.height, `${name} ends below the first screen`).toBeLessThanOrEqual(height)
  }
  await expectNoHorizontalScroll(page)
})

test('the home page leads with selected work, each opening its case study', async ({ page }) => {
  await visit(page)

  const work = page.getByRole('region', { name: 'Selected work' })
  await expect(work.getByRole('heading', { level: 3 })).toHaveText([
    'SOX-Compliant CI/CD for Microsoft Fabric',
    'Unified Cloud Data Platform',
    'Cash Flow Statement Automation',
    'Fantasy Data Engineering & Machine Learning',
  ])

  await work.getByRole('link', { name: 'SOX-Compliant CI/CD for Microsoft Fabric' }).click()
  await expect(page).toHaveURL('/projects/lilly-fabric-cicd')
  await expect(page.getByRole('heading', { level: 1, name: 'SOX-Compliant CI/CD for Microsoft Fabric' })).toBeVisible()
})

test('the portfolio is one click from anywhere', async ({ page }) => {
  await visit(page)

  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Portfolio' }).click()
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
