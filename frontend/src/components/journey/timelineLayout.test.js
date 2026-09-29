import { describe, expect, it } from 'vitest'
import { AFTER_YEAR, GAP, STAGGER, YEAR_GAP, layoutTimeline } from './timelineLayout'

const year = (key, height = 26) => ({ key, kind: 'year', height })
const work = (key, height) => ({ key, kind: 'entry', lane: 'work', height })
const build = (key, height) => ({ key, kind: 'entry', lane: 'build', height })
const topsOf = (items) => Object.fromEntries(layoutTimeline(items).tops)

describe('layoutTimeline', () => {
  it('sets a personal project beside the job it happened during, a step lower', () => {
    const tops = topsOf([year('2022'), work('training', 150), build('sportsbook', 180)])

    const first = 26 + AFTER_YEAR
    expect(tops).toEqual({ 2022: 0, training: first, sportsbook: first + STAGGER })
  })

  it('stacks cards on the same side one under the other, never overlapping', () => {
    const tops = topsOf([year('2021'), build('odin', 130), build('monty', 90), build('ktc', 150)])

    const first = 26 + AFTER_YEAR
    expect(tops).toEqual({
      2021: 0,
      odin: first,
      monty: first + 130 + GAP,
      ktc: first + 130 + GAP + 90 + GAP,
    })
  })

  it('never starts an entry above the one before it, whichever side each is on', () => {
    // A short job card early on, then a long run of personal projects, then
    // another job card: it waits for the last project, not the empty left side.
    const tops = topsOf([year('2022'), work('training', 60), build('a', 200), build('b', 200), work('rules', 60)])

    expect(tops.rules).toBe(tops.b + STAGGER)
    const order = ['training', 'a', 'b', 'rules'].map((key) => tops[key])
    expect(order).toEqual([...order].sort((x, y) => x - y))
  })

  it('starts each year below everything from the year before, cards under its marker', () => {
    const { tops, height } = layoutTimeline([
      year('2021'),
      work('implementations', 300),
      build('odin', 100),
      year('2022', 26),
      build('dominion', 100),
    ])

    const tallest = 26 + AFTER_YEAR + 300
    expect(tops.get('2022')).toBe(tallest + YEAR_GAP)
    expect(tops.get('dominion')).toBe(tallest + YEAR_GAP + 26 + AFTER_YEAR)
    expect(height).toBe(tops.get('dominion') + 100)
  })

  it('stacks everything in order in a single lane (phones)', () => {
    const one = (key, height) => ({ key, kind: 'entry', lane: 'one', height })
    const tops = topsOf([year('2022'), one('training', 150), one('dominion', 100)])

    expect(tops.dominion).toBe(tops.training + 150 + GAP)
  })

  it('lays out nothing as an empty timeline', () => {
    expect(layoutTimeline([])).toEqual({ tops: new Map(), height: 0 })
  })
})
