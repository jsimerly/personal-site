import { describe, expect, it } from 'vitest'
import { formatMonth, formatRange } from './format'

describe('formatMonth', () => {
  it('shows a year and month as the short month and year', () => {
    expect(formatMonth('2021-11')).toBe('Nov 2021')
    expect(formatMonth('2024-01')).toBe('Jan 2024')
  })

  it('keeps a year on its own as just the year, for when the month is not known', () => {
    expect(formatMonth('2016')).toBe('2016')
  })
})

describe('formatRange', () => {
  it('joins a start and end with an en dash', () => {
    expect(formatRange('Mar 2026', 'Current')).toBe('Mar 2026 – Current')
  })
})
