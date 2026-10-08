import { describe, expect, it } from 'vitest'
import { DEFAULTS, playerPath, playersPath, readSettings, settingsQuery } from './settings'

const read = (query) => readSettings(new URLSearchParams(query))

describe('Fantasy settings', () => {
  it('reads the defaults from an empty URL', () => {
    expect(read('')).toEqual({ league: '', unit: 'war', rate: 0.2, years: 10, market: 'ktc', fair: 'rank' })
  })

  it('reads every setting the URL names', () => {
    expect(read('league=office&unit=par_ros&rate=0.35&years=3&market=rd_1qb&fair=curve')).toEqual({
      league: 'office',
      unit: 'par_ros',
      rate: 0.35,
      years: 3,
      market: 'rd_1qb',
      fair: 'curve',
    })
  })

  it('falls back to the default for anything that is not a valid choice', () => {
    expect(read('unit=wins&rate=2&years=4&market=espn&fair=vibes')).toEqual(DEFAULTS)
    expect(read('rate=-0.1')).toEqual(DEFAULTS)
    expect(read('rate=soon')).toEqual(DEFAULTS)
  })

  it('accepts a rate of zero and rounds a rate to whole percents', () => {
    expect(read('rate=0').rate).toBe(0)
    expect(read('rate=0.333').rate).toBe(0.33)
  })

  it('writes only the settings moved off their defaults, in a fixed order', () => {
    expect(settingsQuery(DEFAULTS)).toBe('')
    expect(settingsQuery({ ...DEFAULTS, fair: 'curve', rate: 0.5, league: 'office' })).toBe('league=office&rate=0.5&fair=curve')
  })

  it('builds the board address from the settings', () => {
    expect(playersPath(DEFAULTS)).toBe('/api/fantasy-analysis/players/')
    expect(playersPath({ ...DEFAULTS, market: 'fc', years: 5 })).toBe('/api/fantasy-analysis/players/?years=5&market=fc')
  })

  it("builds a player's address from only the settings that change their seasons", () => {
    expect(playerPath('avery-stone-qb', DEFAULTS)).toBe('/api/fantasy-analysis/players/avery-stone-qb/')
    expect(playerPath('avery-stone-qb', { ...DEFAULTS, league: 'office', rate: 0, years: 3, unit: 'par', market: 'fc' })).toBe(
      '/api/fantasy-analysis/players/avery-stone-qb/?league=office&rate=0&years=3',
    )
  })
})
