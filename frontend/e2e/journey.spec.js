/**
 * The home page's journey: the timeline and the skills basket riding down its
 * middle (desktop only; phones get the skill tray instead).
 */
import { expect, test } from './fixtures'
import { holdFonts, visit } from './helpers'

test.describe('the skills basket', () => {
  test('holds only Curious until the reader scrolls, then starts collecting', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'The basket is the desktop layout; phones get the skill tray.')
    // A screen tall enough that the first cards start out above the line that
    // collects their skills (65% of the way down), however much sits above
    // the journey.
    await visit(page)
    const firstCard = await page.evaluate(() => document.querySelector('[data-journey-entry]').getBoundingClientRect().top + window.scrollY)
    await page.setViewportSize({ width: 1920, height: Math.ceil(firstCard / 0.65) + 200 })
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
  // The settled layout: once the web font is in and the layout has had a
  // frame to respond. (The frames in between are the next test's job.)
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
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
  const rules = laidOut.find((card) => card.title === 'Rules of Engagement Project')
  const sportsbook = laidOut.find((card) => card.title === 'Stuck in High School Sportsbook')
  expect(rules.left).not.toBe(sportsbook.left)
  expect(rules.cardTop).toBeLessThan(sportsbook.cardBottom)
})

// The sorted skills are one screen's worth. Every skill added lands in a
// row, so this is what stops the block outgrowing a laptop screen.
test('fits the sorted skills, heading and all, on a 1280x720 laptop screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The rows are the desktop layout; phones get the skill tray.')
  await page.setViewportSize({ width: 1280, height: 720 })
  await visit(page)
  const today = await page.evaluate(() => document.querySelector('[data-journey-end]').getBoundingClientRect().top + window.scrollY)
  for (let y = today - 1200; y < today + 2000; y += 120) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    if (await page.locator('[data-basket="desktop"] button[aria-pressed]').count()) break
  }
  await page.waitForTimeout(900)

  const block = await page.locator('[data-basket="desktop"]').boundingBox()
  const header = await page.getByRole('banner').boundingBox()
  expect(block.y, 'the block starts under the header').toBeGreaterThanOrEqual(header.y + header.height)
  expect(block.y + block.height, 'the block ends within the screen').toBeLessThanOrEqual(720)
  await expect(page.getByRole('heading', { name: 'What I bring today' })).toBeInViewport({ ratio: 1 })
})

// When the web font arrives, chips re-wrap and cards change height. The
// layout has to move the cards below in the same frame, or one frame paints a
// card over its neighbor. A ResizeObserver made after the page's own runs
// after its handler in each frame, so it sees what is about to be painted.
test('never paints one card over another, even in the frame the web font arrives and cards re-wrap', async ({ page }) => {
  const release = await holdFonts(page)
  await visit(page, '', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-journey-entry]').first().waitFor()
  await page.evaluate(() => {
    window.paintedOverlaps = []
    const check = () => {
      const cards = [...document.querySelectorAll('[data-journey-entry]')].map((row) => {
        const card = row.children[1].getBoundingClientRect()
        return { title: row.querySelector('h3').textContent, left: Math.round(card.left), top: card.top, bottom: card.bottom }
      })
      cards.forEach((a, i) =>
        cards.slice(i + 1).forEach((b) => {
          if (a.left === b.left && a.top < b.bottom - 1 && b.top < a.bottom - 1) window.paintedOverlaps.push(`${a.title} / ${b.title}`)
        }),
      )
    }
    const probe = new ResizeObserver(check)
    document.querySelectorAll('[data-journey-entry]').forEach((row) => probe.observe(row))
  })

  release()
  await page.waitForFunction(() => document.fonts.status === 'loaded')
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))

  expect(await page.evaluate(() => window.paintedOverlaps)).toEqual([])
})

test('splits the skills into rows as they pass Today, never into the cards, and lands them before the projects', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The basket is the desktop layout; phones get the skill tray.')
  const settle = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const places = () => page.evaluate(() => [...document.querySelectorAll('[data-basket-skill]')].map((bubble) => bubble.style.transform).join('|'))
  const todayAt = () => page.evaluate(() => document.querySelector('[data-journey-end]').getBoundingClientRect().top)
  // Any card overlapping what the basket shows (its heading, bubbles, labels,
  // and dividers), as "card / skill". Only what's actually visible counts: a
  // piece faded out, or clipped away by its container, can't collide.
  const collisions = () =>
    page.evaluate(() => {
      const root = document.querySelector('[data-basket="desktop"]')
      const visible = (element) => {
        let box = element.getBoundingClientRect()
        let opacity = 1
        for (let node = element; node && node !== root.parentElement; node = node.parentElement) {
          const style = getComputedStyle(node)
          opacity *= Number(style.opacity)
          if (node !== element && style.overflow !== 'visible') {
            const clip = node.getBoundingClientRect()
            box = {
              left: Math.max(box.left, clip.left),
              right: Math.min(box.right, clip.right),
              top: Math.max(box.top, clip.top),
              bottom: Math.min(box.bottom, clip.bottom),
            }
          }
        }
        return opacity > 0 && box.right > box.left && box.bottom > box.top ? box : null
      }
      const basket = [...root.querySelectorAll(':is(h3, li)')]
        .map((element) => ({ name: element.textContent, box: visible(element) }))
        .filter(({ box }) => box)
      const cards = [...document.querySelectorAll('[data-journey-entry]')].map((row) => ({
        name: row.querySelector('h3').textContent,
        box: row.children[1].getBoundingClientRect(),
      }))
      const meet = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
      return cards.flatMap((card) => basket.filter((piece) => meet(card.box, piece.box)).map((piece) => `${card.name} / ${piece.name}`))
    })

  for (const [width, height] of [
    [1280, 720],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height })
    await visit(page)
    // Start with every card collected and "Today" still below the middle:
    // "Today" just above the collect line (65% down), with every card above
    // it. Measured against the page, not offsetTop, which counts from the
    // timeline's own box. Then wait for the last skills to land, and go on
    // through the whole sort a little at a time, checking at every step.
    await page.evaluate(() => {
      const today = document.querySelector('[data-journey-end]').getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, today - window.innerHeight * 0.6)
    })
    let cloud = await places()
    for (let still = 0; still < 3; ) {
      await page.waitForTimeout(250)
      const now = await places()
      still = now === cloud ? still + 1 : 0
      cloud = now
    }
    const python = page.locator('[data-basket="desktop"]').getByRole('button', { name: 'Python' })
    let splitAt = null
    const seen = []
    while (!(await python.isEnabled())) {
      if (splitAt === null && (await places()) !== cloud) splitAt = await todayAt()
      seen.push(...(await collisions()))
      await page.evaluate(() => window.scrollBy(0, 20))
      await settle()
    }

    // The rows start splitting just as "Today" passes the middle of the screen,
    // where the cloud rides.
    expect(splitAt).toBeGreaterThan(height / 2 - 60)
    expect(splitAt).toBeLessThanOrEqual(height / 2)
    expect([...new Set(seen)]).toEqual([])
    // The rows have all landed before the project cards are fully on screen.
    const projects = await page.getByRole('region', { name: 'Projects' }).boundingBox()
    expect(projects.y + projects.height).toBeGreaterThan(height)
  }
})
