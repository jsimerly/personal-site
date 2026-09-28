import { describe, expect, it } from 'vitest'
import { erasOf } from './eras'

const build = (date) => ({ date, side: 'build' })
const formal = (date, org, end) => ({ date, side: 'work', org, end })

describe('erasOf', () => {
  it('runs each place until the next one starts', () => {
    const entries = [formal('2020-01', 'School'), build('2021-01'), formal('2022-01', 'Acme'), build('2023-01')]

    expect(erasOf(entries)).toEqual([
      { org: 'School', start: 0, until: 2 },
      { org: 'Acme', start: 2, until: 4 },
    ])
  })

  it('ends a place early when its end date passes before the next place starts', () => {
    const entries = [formal('2020-01', 'School', '2021-06'), build('2021-03'), build('2021-09'), formal('2022-01', 'Acme')]

    expect(erasOf(entries)[0]).toEqual({ org: 'School', start: 0, until: 2 })
  })

  it('keeps consecutive entries at the same place in one era', () => {
    const entries = [formal('2022-01', 'Acme'), build('2023-01'), formal('2024-01', 'Acme'), build('2025-01')]

    expect(erasOf(entries)).toEqual([{ org: 'Acme', start: 0, until: 4 }])
  })

  it('treats an ongoing place as running to the end', () => {
    const entries = [formal('2022-01', 'Acme', 'now'), build('2023-01')]

    expect(erasOf(entries)).toEqual([{ org: 'Acme', start: 0, until: 2 }])
  })

  it('ignores personal entries and formal ones with no place', () => {
    expect(erasOf([build('2021-01'), { date: '2022-01', side: 'work' }])).toEqual([])
  })
})
