/**
 * "Work with me", end to end: the visitor types an email or a phone number,
 * the real API stores it as a lead and emails me. In the E2E lane leads land
 * in api/e2e/gcs/<leads bucket>/ and emails in api/e2e/outbox/, so the specs
 * check both.
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from './fixtures'
import { cutApi, expectNoHorizontalScroll, visit } from './helpers'

const API = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../api/e2e')
const LEADS = path.join(API, 'gcs', 'jacobsimerly-site-leads')
const OUTBOX = path.join(API, 'outbox')

const filesIn = (dir) => {
  try {
    return readdirSync(dir, { recursive: true }).map((name) => path.join(dir, name)).filter((file) => /\.(json|log)$/.test(file))
  } catch {
    return []
  }
}
// The stored lead and the email for one contact, once both have been written.
// The email is found by its body's "Email:" or "Phone:" line (a long subject
// header gets folded onto two lines).
const leadFor = (contact) =>
  filesIn(LEADS)
    .map((file) => JSON.parse(readFileSync(file, 'utf8')))
    .find((lead) => lead.contact === contact)
const emailFor = (contact) =>
  filesIn(OUTBOX)
    .map((file) => readFileSync(file, 'utf8').replaceAll('\r\n', '\n'))
    .find((mail) => mail.split('\n').some((line) => line === `Email: ${contact}` || line === `Phone: ${contact}`))

// A contact no other run or project has used, so each test finds its own lead.
const unique = (testInfo) => `visitor-${testInfo.project.name}-${Date.now()}@example.com`

test('a visitor leaves an email from the first screen in one motion, and it is stored and emailed to me', async ({ page }, testInfo) => {
  const email = unique(testInfo)
  await visit(page)

  await page.getByRole('button', { name: 'Work with me' }).click()
  // No second button: the cursor is already in the field.
  await page.keyboard.type(email)
  await page.keyboard.press('Enter')

  await expect(page.getByRole('status').filter({ hasText: 'Got it' })).toHaveText("Got it. I'll get back to you within a day.")
  await expectNoHorizontalScroll(page)
  await expect.poll(() => leadFor(email)).toMatchObject({ kind: 'email', contact: email, source: 'hero' })
  await expect.poll(() => emailFor(email)).toContain(`Email: ${email}\nFrom: the top of the home page\n`)
})

test('the end of the page has the field already open, and takes a phone number', async ({ page }, testInfo) => {
  // Digits unique to this run and project: 10 of them, as a US number.
  const digits = `9${String(Date.now()).slice(-8)}${testInfo.project.name === 'mobile' ? 1 : 2}`
  await visit(page)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))

  const field = page.getByRole('region', { name: 'Want to build something together?' }).getByRole('textbox', { name: 'Your email or phone' })
  await field.fill(`(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`)
  await field.press('Enter')

  await expect(page.getByRole('status').filter({ hasText: 'Got it' })).toBeVisible()
  await expect.poll(() => leadFor(digits)).toMatchObject({ kind: 'phone', contact: digits, source: 'footer' })
  await expect.poll(() => emailFor(digits)).toContain(`Call or text: tel:${digits}`)
})

test('a typo is caught on the page, before anything reaches the API', async ({ page }) => {
  const posts = []
  page.on('request', (request) => request.method() === 'POST' && posts.push(request.url()))
  await visit(page)

  await page.getByRole('button', { name: 'Work with me' }).click()
  await page.keyboard.type('jane@exam')
  await page.keyboard.press('Enter')

  await expect(page.getByRole('alert')).toHaveText("That doesn't look like an email or a phone number.")
  expect(posts).toEqual([])
})

test.describe('when the API is down', () => {
  test.use({ allowedErrors: [/^Failed to load resource/] })

  test('the visitor is told to try again, and keeps what they typed', async ({ page }) => {
    await cutApi(page)
    await visit(page)

    await page.getByRole('button', { name: 'Work with me' }).click()
    await page.keyboard.type('jane@example.com')
    await page.keyboard.press('Enter')

    await expect(page.getByRole('alert')).toHaveText("Couldn't send that just now. Try again in a moment.")
    // The first-screen field: the end of the page has its own, further down.
    await expect(page.getByRole('textbox', { name: 'Your email or phone' }).first()).toHaveValue('jane@example.com')
  })
})
