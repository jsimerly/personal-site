/**
 * The `test` every spec imports instead of Playwright's own. It fails any
 * test whose page throws or logs an error, so a broken chunk, a CORS refusal,
 * or a React crash can't hide behind passing assertions. A spec that expects
 * errors (the API being down) lists them: test.use({ allowedErrors: [/.../] }).
 */
import { test as base, expect } from '@playwright/test'

export const test = base.extend({
  allowedErrors: [[], { option: true }],

  page: async ({ page, allowedErrors }, use) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })

    await use(page)

    const unexpected = errors.filter((text) => !allowedErrors.some((pattern) => pattern.test(text)))
    expect(unexpected, 'the page logged errors').toEqual([])
  },
})

export { expect }
