import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { fakeFetch } from '../test/fakeFetch'
import { MODEL, model } from '../test/fantasyApi'
import ModelPage from './ModelPage.jsx'

function renderPage(routes = { [MODEL]: model }) {
  fakeFetch(routes)
  render(<ModelPage />)
  return screen.findByRole('group', { name: 'Rest of season' })
}

// Every row of a table, header row included, as the text of each cell.
const grid = (name) =>
  within(screen.getByRole('table', { name }))
    .getAllByRole('row')
    .map((row) => [...row.querySelectorAll('th, td')].map((cell) => cell.textContent))

describe('Model performance', () => {
  it('leads with the headline numbers from the backtests', async () => {
    await renderPage()

    expect(screen.getByRole('group', { name: 'Rest of season' })).toHaveTextContent(
      'Rest of season0.784Rank agreement with how players finished the season, from a week 3 snapshot. The market scores 0.704.',
    )
    expect(screen.getByRole('group', { name: '3-year value' })).toHaveTextContent(
      '3-year value0.669Rank agreement with the value players delivered over the next 3 seasons, against 0.664 for the market. Blending the two scores 0.684.',
    )
    expect(screen.getByRole('group', { name: 'Called cheap' })).toHaveTextContent(
      'Called cheap+13.5Ranks better than the market had them, on average, for the third of players the model said were too cheap.',
    )
    expect(screen.getByRole('group', { name: 'Projection error' })).toHaveTextContent(
      'Projection error50%Less error than repeating last season, 5 seasons out (29.1 points a season against 57.8).',
    )
    expect(
      screen.getByText('Run 2026-10-07 · career model TabPFN v2 · this week the model and the market agree at 0.931'),
    ).toBeInTheDocument()
  })

  it('charts rest-of-season accuracy against the market, with the same numbers as a table', async () => {
    await renderPage()

    expect(screen.getByRole('img', { name: 'Rest-of-season rank agreement by snapshot week' })).toBeInTheDocument()
    expect(grid('Rest-of-season rank agreement by snapshot week')).toEqual([
      ['Snapshot week', 'Model', 'Market (KTC)', 'Season so far', 'Last season'],
      ['Week 3', '0.784', '0.704', '0.700', '0.600'],
      ['Week 13', '0.692', '0.566', '0.669', '0.470'],
    ])
  })

  it('charts projection error by how far ahead it looks', async () => {
    await renderPage()

    expect(grid('Projection error by seasons ahead')).toEqual([
      ['Seasons ahead', 'Model', 'Age curve', 'Last season'],
      ['1 season ahead', '34.2 pts', '36.1 pts', '38.3 pts'],
      ['5 seasons ahead', '29.1 pts', '31.6 pts', '57.8 pts'],
    ])
  })

  it('reads every series at the hovered week, best first, until the pointer leaves', async () => {
    await renderPage()
    const chart = screen.getByRole('img', { name: 'Rest-of-season rank agreement by snapshot week' })
    const target = within(chart).getByTestId('chart-hover')

    // jsdom lays nothing out, so the plot starts at x = 0 and spans 478 px: the last week is the nearest.
    fireEvent.pointerMove(target, { clientX: 400 })

    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Week 13Model0.692Season so far0.669Market (KTC)0.566Last season0.470',
    )
    expect(within(chart).getByTestId('crosshair')).toBeInTheDocument()

    fireEvent.pointerMove(target, { clientX: 10 })
    expect(screen.getByRole('tooltip')).toHaveTextContent(/^Week 3Model0.784/)

    fireEvent.pointerLeave(target)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('sets out the value backtest by cohort, then whether the mispricing paid', async () => {
    await renderPage()

    expect(grid('3-year value rank agreement by cohort')).toEqual([
      ['Cohort', 'Players', 'Model', 'Market', '50/50 blend'],
      ['2020', '91', '0.687', '0.709', '0.717'],
      ['2021', '115', '0.656', '0.630', '0.657'],
      ['Mean', '–', '0.669', '0.664', '0.684'],
    ])
    expect(
      screen.getByText(
        'Model minus market, bootstrapped over players: +0.005, with a 90% interval of −0.068 to +0.076. An interval across zero is a statistical tie.',
      ),
    ).toBeInTheDocument()
    expect(grid('Mispricing thirds and how they finished')).toEqual([
      ['Third', 'Players', 'Finished better by'],
      ['Called cheap', '124', '+13.5'],
      ['Fairly priced', '121', '−6.8'],
      ['Called rich', '121', '−7.0'],
    ])
  })

  it('bolds the best score in each row', async () => {
    await renderPage()

    const [, first, second] = within(screen.getByRole('table', { name: '3-year value rank agreement by cohort' })).getAllByRole('row')
    expect(within(first).getByText('0.717')).toHaveClass('font-semibold')
    expect(within(first).getByText('0.709')).not.toHaveClass('font-semibold')
    expect(within(second).getByText('0.657')).toHaveClass('font-semibold')
  })

  it('compares the model with the market overall, and by position at the longest horizon', async () => {
    await renderPage()

    expect(grid('Model against the market, by model and horizon')).toEqual([
      ['Model', 'Players', 'Model', 'Market', 'Edge', 'Cheap', 'Rich'],
      ['Trees, 3 yr', '366', '0.685', '0.678', '0.319', '+11.9', '−9.5'],
      ['Trees, 1 yr', '857', '0.624', '0.612', '0.321', '+17.5', '−15.3'],
    ])
    expect(grid('Model against the market by position, 3 years out')).toEqual([
      ['Position', 'Players', 'Model', 'Market', 'Edge', 'Cheap', 'Rich'],
      ['Trees, QB', '82', '0.620', '0.665', '0.282', '+10.2', '−8.9'],
      ['Trees, RB', '73', '0.679', '0.609', '0.411', '+17.8', '−6.3'],
    ])
  })

  it('lists the ten best experiments, and the rest on request', async () => {
    await renderPage()
    const experiments = () => grid('Model experiments').slice(1)

    expect(experiments()).toHaveLength(10)
    expect(experiments()[0]).toEqual(['variant_1', '41', '2015-2022', '0.690', '0.664', '0.300'])

    await userEvent.click(screen.getByRole('button', { name: 'Show all 12' }))
    expect(experiments().map((row) => row[0]).slice(-2)).toEqual(['variant_11', 'variant_12'])
    expect(experiments().at(-1)[3]).toBe('–')

    await userEvent.click(screen.getByRole('button', { name: 'Show the top 10' }))
    expect(experiments()).toHaveLength(10)
  })

  it('leaves out the sections a run has no results for', async () => {
    const empty = {
      ...model,
      career: { start_season: null, mae: [] },
      inseason: { cohorts: null, ros: [] },
      value: { ...model.value, terciles: [] },
      market: { cohorts: null, overall: [], by_position: [] },
      experiments: [],
    }
    fakeFetch({ [MODEL]: empty })
    render(<ModelPage />)

    expect(await screen.findByRole('group', { name: '3-year value' })).toBeInTheDocument()
    expect(screen.getAllByRole('group').map((tile) => tile.firstChild.textContent)).toEqual(['3-year value'])
    expect(screen.queryByRole('heading', { name: 'Does the mispricing pay?' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Against the market' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Experiments' })).not.toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('says so when the results cannot load', async () => {
    fakeFetch({})
    render(<ModelPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load this. Try again in a moment.")
  })
})
