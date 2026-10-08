import { describe, expect, it } from 'vitest'
import { niceTicks, spreadLabels } from './chart'

describe('Chart math', () => {
  it('puts the y axis on round steps that cover every value', () => {
    expect(niceTicks(0.4703, 0.7836)).toEqual([0.4, 0.5, 0.6, 0.7, 0.8])
    expect(niceTicks(29.0876, 57.8385)).toEqual([20, 30, 40, 50, 60])
    expect(niceTicks(0, 1)).toEqual([0, 0.25, 0.5, 0.75, 1])
  })

  it('still draws an axis when every value is the same', () => {
    expect(niceTicks(0.5, 0.5)).toEqual([0.4, 0.6])
    expect(niceTicks(0, 0)).toEqual([0, 0.25])
  })

  it('pushes end labels apart so none overlap, keeping their order', () => {
    const labels = [
      { key: 'a', y: 50 },
      { key: 'b', y: 45 },
      { key: 'c', y: 100 },
    ]

    expect(spreadLabels(labels, 14, 200)).toEqual([
      { key: 'b', y: 45 },
      { key: 'a', y: 59 },
      { key: 'c', y: 100 },
    ])
  })

  it('shifts a stack of labels up when it would run past the bottom of the plot', () => {
    expect(spreadLabels([{ y: 195 }, { y: 196 }], 14, 200).map((label) => label.y)).toEqual([186, 200])
    expect(spreadLabels([], 14, 200)).toEqual([])
  })
})
