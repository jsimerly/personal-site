import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LineChart from './LineChart.jsx'

const rows = [
  { week: 1, model: 0.8, market: 0.7 },
  { week: 2, model: 0.6, market: null },
]

function renderChart() {
  return render(
    <LineChart
      label="Accuracy by week"
      rows={rows}
      x={{ key: 'week', title: 'Week', format: (week) => `Week ${week}` }}
      y={{ format: (value) => value.toFixed(2) }}
      series={[
        { key: 'model', label: 'Model', model: true },
        { key: 'market', label: 'Market', dash: 'dashed' },
      ]}
    />,
  )
}

describe('LineChart', () => {
  it('names every series in a legend and at the end of its line', () => {
    renderChart()

    expect(within(screen.getByRole('list')).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Model',
      'Market',
    ])
    expect([...screen.getByRole('img').querySelectorAll('text')].slice(-2).map((text) => text.textContent).sort()).toEqual([
      'Market',
      'Model',
    ])
  })

  it('skips missing values in the line, the tooltip, and the table', () => {
    renderChart()

    fireEvent.pointerMove(screen.getByTestId('chart-hover'), { clientX: 470 })

    expect(screen.getByRole('tooltip')).toHaveTextContent('Week 2Model0.60')
    expect(screen.getByRole('row', { name: /Week 2/ })).toHaveTextContent('Week 20.60–')
  })

  it('draws at the width of its container as the container resizes', () => {
    let resize
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback) {
          resize = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    renderChart()
    expect(screen.getByRole('img')).toHaveAttribute('width', '640')

    act(() => resize([{ contentRect: { width: 360.4 } }]))

    expect(screen.getByRole('img')).toHaveAttribute('width', '360')
  })
})
