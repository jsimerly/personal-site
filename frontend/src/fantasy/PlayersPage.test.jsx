import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { fakeFetch } from '../test/fakeFetch'
import { PLAYERS, averyStone, players } from '../test/fantasyApi'
import PlayersPage from './PlayersPage.jsx'

const AVERY = '/api/fantasy-analysis/players/avery-stone-qb/?league=home'

// Shows the current query string, so tests can see what the URL holds.
function Search() {
  return <p data-testid="url">{useLocation().search}</p>
}

function renderAt(path = '/fantasy-analysis', routes = { [PLAYERS]: players(), [AVERY]: averyStone }) {
  const fetch = fakeFetch(routes)
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/fantasy-analysis"
          element={
            <>
              <PlayersPage />
              <Search />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
  return fetch
}

const table = () => screen.getByRole('table', { name: 'Player values' })
const board = () => screen.findByRole('table', { name: 'Player values' })
// The players on the board, top to bottom: each row's name button.
const names = () =>
  within(table())
    .getAllByRole('button')
    .filter((button) => button.hasAttribute('aria-expanded'))
    .map((button) => button.textContent)
const rowOf = (name) => screen.getByRole('button', { name }).closest('tr')
const cells = (row) => within(row).getAllByRole('cell').map((cell) => cell.textContent)
const url = () => screen.getByTestId('url').textContent
const fetched = (fetch) => fetch.mock.calls.map(([path]) => path)

describe('Player values', () => {
  it('shows the priced, non-fringe players by rank, with the run they come from', async () => {
    renderAt()
    await board()

    expect(names()).toEqual(['Blake Rivers', 'Avery Stone', 'Casey Field'])
    expect(screen.getByText('3 of 5 players')).toBeInTheDocument()
    expect(
      screen.getByText(
        'in-season, 2026 through week 4 · run 2026-10-07 · 5 players, 4 priced by KTC dynasty (SF) · career model TabPFN v2',
      ),
    ).toBeInTheDocument()
  })

  it('fills each row from the API, showing the market only as ranks and percentages', async () => {
    renderAt()
    await board()

    expect(cells(rowOf('Blake Rivers'))).toEqual([
      '1',
      'Blake RiversDET',
      'RB',
      '23',
      '19.7',
      '19.1',
      '190',
      '1.82',
      '7.38',
      '4.6–10.4',
      '767',
      '2',
      '1',
      '−1',
      '−30%',
      '−10%',
    ])
  })

  it('groups the columns and names each by its group for screen readers', async () => {
    renderAt()
    await board()

    expect(within(table()).getAllByRole('columnheader').slice(0, 4).map((th) => th.textContent)).toEqual([
      'Player',
      'Rest of season',
      'Career',
      'Market',
    ])
    expect(screen.getByRole('button', { name: 'Rank' })).toHaveTextContent('#')
    expect(screen.getByRole('button', { name: 'Rest of season PAR' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Career PAR' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Market Mispricing' })).toBeInTheDocument()
  })

  it('describes the league the values are for', async () => {
    renderAt()
    await board()

    expect(screen.getByText(/^: 10 teams/).closest('p')).toHaveTextContent(
      "Home League: 10 teams starting 1 QB, 2 RB, 3 WR, 1 TE, 1 FLEX, 1 superflex. Replacement level, in points a week: QB 13.4, RB 8.9, WR 9.5, TE 7.2. Ten more points a week is worth about 0.35 wins a week to an average team. The model is trained on this league's scoring.",
    )
  })

  it('refetches when a setting changes, and keeps every setting in the URL', async () => {
    const steps = [
      ['Rank by', 'Career PAR (points)', 'unit=par'],
      ['Years', '5', 'unit=par&years=5'],
      ['Market', 'FantasyCalc dynasty (SF)', 'unit=par&years=5&market=fc'],
      ['Fair price', 'Curve fit', 'unit=par&years=5&market=fc&fair=curve'],
      ['League', 'Office League', 'league=office&unit=par&years=5&market=fc&fair=curve'],
    ]
    const fetch = renderAt('/fantasy-analysis', {
      [PLAYERS]: players(),
      ...Object.fromEntries(steps.map(([, , query]) => [`${PLAYERS}?${query}`, players()])),
    })
    await board()

    for (const [control, option, query] of steps) {
      await userEvent.selectOptions(screen.getByRole('combobox', { name: control }), option)
      expect(url()).toBe(`?${query}`)
      await waitFor(() => expect(fetched(fetch).at(-1)).toBe(`${PLAYERS}?${query}`))
    }
    expect(screen.getByRole('combobox', { name: 'League' })).toHaveDisplayValue('Office League')
  })

  it('shows a new discount rate at once and refetches once the slider settles', async () => {
    const fetch = renderAt('/fantasy-analysis', { [PLAYERS]: players(), [`${PLAYERS}?rate=0.35`]: players({ rate: 0.35 }) })
    await board()

    fireEvent.change(screen.getByRole('slider', { name: 'Discount rate' }), { target: { value: '35' } })

    expect(screen.getByRole('slider', { name: 'Discount rate' })).toHaveAttribute('aria-valuetext', '35% a year')
    expect(screen.getByText('35% a year')).toBeInTheDocument()
    expect(url()).toBe('?rate=0.35')
    expect(fetched(fetch)).toEqual([PLAYERS])
    await waitFor(() => expect(fetched(fetch)).toEqual([PLAYERS, `${PLAYERS}?rate=0.35`]))
  })

  it('keeps the board on screen, marked busy, while new values load', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((path) =>
        path === PLAYERS ? Promise.resolve({ ok: true, json: async () => players() }) : new Promise(() => {}),
      ),
    )
    render(
      <MemoryRouter initialEntries={['/fantasy-analysis']}>
        <Routes>
          <Route path="/fantasy-analysis" element={<PlayersPage />} />
        </Routes>
      </MemoryRouter>,
    )
    await board()
    expect(table().parentElement).toHaveAttribute('aria-busy', 'false')

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Years' }), '3')

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(`${PLAYERS}?years=3`, expect.anything()))
    expect(table().parentElement).toHaveAttribute('aria-busy', 'true')
    expect(names()).toEqual(['Blake Rivers', 'Avery Stone', 'Casey Field'])
  })

  it('opens on the settings in the URL', async () => {
    const path = `${PLAYERS}?league=office&years=5&market=fc`
    const fetch = renderAt('/fantasy-analysis?market=fc&league=office&years=5', {
      [path]: players({ league: 'office', years: 5, market: 'fc' }),
    })
    await board()

    expect(fetched(fetch)).toEqual([path])
    expect(screen.getByRole('combobox', { name: 'League' })).toHaveDisplayValue('Office League')
    expect(screen.getByRole('combobox', { name: 'Years' })).toHaveDisplayValue('5')
    expect(screen.getByRole('combobox', { name: 'Market' })).toHaveDisplayValue('FantasyCalc dynasty (SF)')
    expect(screen.getByText(/priced by FantasyCalc dynasty \(SF\)/)).toBeInTheDocument()
  })

  it('narrows the board by name, position, and how the market prices a player', async () => {
    renderAt()
    await board()

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search players' }), 'RIV')
    expect(names()).toEqual(['Blake Rivers'])
    await userEvent.clear(screen.getByRole('searchbox', { name: 'Search players' }))

    await userEvent.click(within(screen.getByRole('group', { name: 'Position' })).getByRole('button', { name: 'WR' }))
    expect(names()).toEqual(['Casey Field'])
    expect(screen.getByRole('button', { name: 'WR' })).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(screen.getByRole('checkbox', { name: 'Priced only' }))
    expect(names()).toEqual(['Casey Field'])
    await userEvent.click(screen.getByRole('checkbox', { name: 'Skip fringe players' }))
    expect(names()).toEqual(['Casey Field', 'Emery Hill'])
    expect(screen.getByText('2 of 5 players')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(names()).toEqual(['Blake Rivers', 'Avery Stone', 'Casey Field', 'Drew Lake', 'Emery Hill'])
  })

  it('sorts by any column, flipping on a second click, with missing values last', async () => {
    renderAt()
    await board()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Priced only' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Skip fringe players' }))

    await userEvent.click(screen.getByRole('button', { name: 'Market Mispricing' }))
    expect(names()).toEqual(['Blake Rivers', 'Drew Lake', 'Avery Stone', 'Casey Field', 'Emery Hill'])
    expect(screen.getByRole('button', { name: 'Market Mispricing' }).closest('th')).toHaveAttribute('aria-sort', 'ascending')

    await userEvent.click(screen.getByRole('button', { name: 'Market Mispricing' }))
    expect(names()).toEqual(['Casey Field', 'Avery Stone', 'Drew Lake', 'Blake Rivers', 'Emery Hill'])
    expect(screen.getByRole('button', { name: 'Market Mispricing' }).closest('th')).toHaveAttribute('aria-sort', 'descending')

    // Value columns start with the most.
    await userEvent.click(screen.getByRole('button', { name: 'Rest of season Proj PPG' }))
    expect(names()).toEqual(['Blake Rivers', 'Avery Stone', 'Casey Field', 'Drew Lake', 'Emery Hill'])

    await userEvent.click(screen.getByRole('button', { name: 'Player' }))
    expect(names()).toEqual(['Avery Stone', 'Blake Rivers', 'Casey Field', 'Drew Lake', 'Emery Hill'])
    expect(screen.getByRole('button', { name: 'Market Mispricing' }).closest('th')).not.toHaveAttribute('aria-sort')
  })

  it("opens a player's seasons under their row, valued in the board's league", async () => {
    const fetch = renderAt()
    await board()

    await userEvent.click(screen.getByRole('button', { name: 'Avery Stone' }))

    expect(screen.getByRole('button', { name: 'Avery Stone' })).toHaveAttribute('aria-expanded', 'true')
    const seasons = await screen.findByRole('table', { name: 'Avery Stone, season by season' })
    expect(fetched(fetch)).toContain(AVERY)
    const rows = within(seasons).getAllByRole('row').slice(1)
    expect(rows.map((row) => [...row.querySelectorAll('th, td')].map((cell) => cell.textContent))).toEqual([
      ['ROS ’26', '224', '17.2', '150', '1.44', '0.90–2.04', '1.00'],
      ['’27', '298', '18.6 (13.7–23.6)', '178', '1.71', '1.06–2.41', '0.80'],
      ['’28', '304', '19.0 (13.9–24.1)', '188', '1.81', '–', '0'],
    ])
    const facts = screen.getByText('Preseason value (points)').closest('dl')
    expect([...facts.children].map((pair) => pair.textContent)).toEqual([
      'Points ’25298',
      'Games ’2516',
      'Games so far ’264',
      'Projected games, ROS ’2613.0',
      'Projected points, ROS ’26224',
      'Preseason value (points)647',
    ])

    await userEvent.click(screen.getByRole('button', { name: 'Avery Stone' }))
    expect(screen.getByRole('button', { name: 'Avery Stone' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('table', { name: 'Avery Stone, season by season' })).not.toBeInTheDocument()
  })

  it('leaves out games so far before the season starts', async () => {
    renderAt('/fantasy-analysis', {
      [PLAYERS]: players({}, { meta: { ...players().meta, mode: 'preseason' } }),
      [AVERY]: averyStone,
    })
    await board()

    expect(screen.queryByRole('button', { name: 'Rest of season PPG so far' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Avery Stone' }))
    await screen.findByText('Preseason value (points)')
    expect(screen.queryByText('Games so far ’26')).not.toBeInTheDocument()
  })

  it('says so when the board cannot load', async () => {
    renderAt('/fantasy-analysis', {})

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load this. Try again in a moment.")
  })
})
