import { describe, expect, it } from 'vitest'
import { LASTING_MIN_FONT_PX, SORTED_MAX_FONT_PX, SORTED_MIN_FONT_PX, sortedFontPx, skillColor } from './bubble'

describe('skillColor', () => {
  it('is pure blue for a skill grown only at work', () => {
    expect(skillColor({ work: 4, build: 0 })).toBe('color-mix(in oklch, var(--color-work) 100%, var(--color-both))')
  })

  it('is pure red for a skill grown only in builds', () => {
    expect(skillColor({ work: 0, build: 3 })).toBe('color-mix(in oklch, var(--color-build) 100%, var(--color-both))')
  })

  it('is pure purple for an even split', () => {
    expect(skillColor({ work: 2, build: 2 })).toMatch(/ 0%, var\(--color-both\)\)$/)
  })

  it('leans toward the side that contributed more, by how much more', () => {
    expect(skillColor({ work: 3, build: 1 })).toBe('color-mix(in oklch, var(--color-work) 50%, var(--color-both))')
    expect(skillColor({ work: 1, build: 9 })).toBe('color-mix(in oklch, var(--color-build) 80%, var(--color-both))')
  })
})

describe('sortedFontPx', () => {
  it('keeps a skill that sticks around at least a step bigger than the faded ones, growing with its points', () => {
    expect(sortedFontPx(0.5, true)).toBe(LASTING_MIN_FONT_PX)
    expect(sortedFontPx(1000, true)).toBe(SORTED_MAX_FONT_PX)
    expect(LASTING_MIN_FONT_PX).toBeGreaterThan(SORTED_MIN_FONT_PX)
  })

  it('gives every faded skill the same small size, however many points it has', () => {
    expect([sortedFontPx(0.5, false), sortedFontPx(1000, false)]).toEqual([SORTED_MIN_FONT_PX, SORTED_MIN_FONT_PX])
  })
})
