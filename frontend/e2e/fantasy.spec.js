/**
 * The fantasy analysis section, reading the real API, which reads the made-up
 * dynasty pages under api/e2e/gcs (two weekly runs; the newer is week 4).
 * Those pages also carry everything the public site must never show: league
 * rosters and trades with people's names, and the market's own prices.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from './fixtures'
import { expectNoHorizontalScroll, visit } from './helpers'

const PAGES = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../api/e2e/gcs/fantasy-football-ml/dynasty-value/pages/season=2026',
)
const DEFAULT_BOARD = [
  'Blake Rivers',
  'Casey Field',
  'Avery Stone',
  'Logan Shaw',
  'Gray Monroe',
  'Finley Brook',
  'Emery Hill',
  'Jordan Pike',
  'Kai Mercer',
  'Harper Vance',
  'Drew Lake',
  'Indy Rowe',
  'Morgan Reyes',
]

const board = (page) => page.getByRole('table', { name: 'Player values' })
// The names on the board, top to bottom.
const names = (page) => board(page).locator('tbody button[aria-expanded]')
const cellsOf = (page, name) => board(page).getByRole('row').filter({ has: page.getByRole('button', { name, exact: true }) }).getByRole('cell')

test('the board shows the newest run, priced players first by value', async ({ page }) => {
  await visit(page, 'fantasy-analysis')

  await expect(names(page)).toHaveText(DEFAULT_BOARD)
  await expect(
    page.getByText(
      'in-season, 2026 through week 4 · run 2026-10-07 · 16 players, 14 priced by KTC dynasty (SF) · career model TabPFN v2',
    ),
  ).toBeVisible()
  await expect(page.getByText('13 of 16 players')).toBeVisible()
  await expect(cellsOf(page, 'Jordan Pike')).toHaveText([
    '8',
    'Jordan PikeATL',
    'RB',
    '22',
    '15.3',
    '14.9',
    '103',
    '0.99',
    '4.16',
    '2.6–5.9',
    '433',
    '4',
    '8',
    '+4',
    '+31%',
    '+31%',
  ])
  await expectNoHorizontalScroll(page)
})

test('moving the discount rate revalues the board and keeps the rate in the address', async ({ page }) => {
  await visit(page, 'fantasy-analysis')
  await expect(names(page).first()).toHaveText('Blake Rivers')

  const revalued = page.waitForResponse((response) => response.url().endsWith('/api/fantasy-analysis/players/?rate=0'))
  await page.getByRole('slider', { name: 'Discount rate' }).fill('0')
  await revalued

  await expect(page).toHaveURL('/fantasy-analysis?rate=0')
  await expect(names(page).first()).toHaveText('Avery Stone')
  await expect(cellsOf(page, 'Avery Stone').nth(8)).toHaveText('12.35')
})

test("another league's settings come back in that league's values", async ({ page }) => {
  await visit(page, 'fantasy-analysis?league=office_league')

  await expect(page.getByRole('combobox', { name: 'League' })).toHaveValue('office_league')
  await expect(page.getByText(/^Office League: 12 teams starting 1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX\./)).toBeVisible()
  await expect(cellsOf(page, 'Avery Stone').nth(8)).toHaveText('5.56')
})

test('a player opens into their projected seasons', async ({ page }) => {
  await visit(page, 'fantasy-analysis')

  await page.getByRole('button', { name: 'Avery Stone', exact: true }).click()

  const seasons = page.getByRole('table', { name: 'Avery Stone, season by season' })
  await expect(seasons.getByRole('row')).toHaveCount(11)
  await expect(seasons.getByRole('row').nth(1).locator('th, td')).toHaveText([
    'ROS ’26',
    '224',
    '17.2',
    '150',
    '1.44',
    '0.90–2.04',
    '1.00',
  ])
  await expect(seasons.getByRole('row').nth(2).locator('th, td')).toHaveText([
    '’27',
    '298',
    '18.6',
    '178',
    '1.71',
    '1.06–2.41',
    '0.80',
  ])
  await expect(page.getByText('Preseason value (points)').locator('..')).toHaveText('Preseason value (points)647')
  await expectNoHorizontalScroll(page)
})

test('the model view leads with the backtests and reads its charts on hover', async ({ page }) => {
  await visit(page, 'fantasy-analysis/model')

  await expect(page.getByRole('group', { name: 'Rest of season' })).toHaveText(
    'Rest of season0.784Rank agreement with how players finished the season, from a week 3 snapshot. The market scores 0.704.',
  )
  await expect(page.getByRole('group', { name: 'Projection error' })).toHaveText(
    'Projection error41%Less error than repeating last season, 5 seasons out (32.8 points a season against 56.0).',
  )

  const chart = page.getByRole('img', { name: 'Rest-of-season rank agreement by snapshot week' })
  // Just inside the plot's left edge: the first snapshot week.
  await chart.getByTestId('chart-hover').hover({ position: { x: 2, y: 20 } })
  await expect(page.getByRole('tooltip')).toHaveText('Week 3Model0.784Market (KTC)0.704Season so far0.700Last season0.600')
  await expectNoHorizontalScroll(page)
})

test("the portfolio's fantasy tab previews the board and leads into it", async ({ page }) => {
  await visit(page, 'portfolio?tab=fantasy-football')

  await expect(page.getByRole('list', { name: 'Top players' }).getByRole('listitem')).toHaveText([
    '1Blake Rivers RB7.38',
    '2Casey Field WR6.63',
    '3Avery Stone QB6.47',
    '4Logan Shaw QB5.21',
    '5Gray Monroe QB4.98',
  ])
  await expectNoHorizontalScroll(page)

  await page.getByRole('link', { name: 'Explore the data' }).click()
  await expect(page).toHaveURL('/fantasy-analysis')
  await expect(names(page)).toHaveText(DEFAULT_BOARD)
})

test('a fantasy address works when opened directly and survives a reload', async ({ page }) => {
  await visit(page, 'fantasy-analysis/model')
  await expect(page.getByRole('link', { name: 'Model performance' })).toHaveAttribute('aria-current', 'page')

  await page.reload()
  await expect(page.getByRole('group', { name: '3-year value' })).toBeVisible()
})

// Every price the market put on a player, and every person in the leagues,
// as the page files hold them.
function privateParts() {
  const prices = new Set()
  const people = new Set()
  const walk = (value, key) => {
    if (Array.isArray(value)) return value.forEach((inner) => walk(inner, key))
    if (value && typeof value === 'object') return Object.entries(value).forEach(([k, inner]) => walk(inner, k))
    if (typeof value === 'number' && /^(ktc|fc|rd_sf|rd_1qb|fair|fair_pos|sell_ktc|buy_ktc)$/.test(key)) prices.add(value)
    if (typeof value === 'string' && /Privateperson/.test(value)) people.add(value)
  }
  for (const week of ['week=3/run_date=2026-10-06', 'week=4/run_date=2026-10-07']) {
    const file = JSON.parse(readFileSync(path.join(PAGES, week, 'projections.json'), 'utf8'))
    walk(file)
    // Picks are rows of [season, round, tier, slot, wins, price].
    file.picks.rows.forEach((pick) => prices.add(pick.at(-1)))
  }
  return { prices: [...prices].filter((price) => price >= 1000), people: [...people] }
}

test('no market price and no league member ever reaches the browser', async ({ page }) => {
  const { prices, people } = privateParts()
  // The check would pass on nothing if the files held nothing private.
  expect(prices).toContain(9640)
  expect(people).toContain('Riley Privateperson')

  const responses = []
  page.on('response', (response) => {
    if (response.url().includes('/api/fantasy-analysis/')) responses.push(response.text())
  })
  const leaks = (text) => [
    ...prices.filter((price) => new RegExp(`(?<![\\d.])${price}(?![\\d])`).test(text)),
    ...people.filter((person) => text.includes(person)),
  ]

  await visit(page, 'fantasy-analysis?market=fc&fair=curve')
  await page.getByRole('button', { name: 'Avery Stone', exact: true }).click()
  await expect(page.getByRole('table', { name: 'Avery Stone, season by season' })).toBeVisible()
  const boardText = await page.locator('body').innerText()
  await visit(page, 'fantasy-analysis/model')
  await expect(page.getByRole('group', { name: '3-year value' })).toBeVisible()
  const modelText = await page.locator('body').innerText()

  const bodies = await Promise.all(responses)
  expect(bodies).toHaveLength(3)
  expect(bodies.flatMap(leaks)).toEqual([])
  expect([...leaks(boardText), ...leaks(modelText)]).toEqual([])
})
