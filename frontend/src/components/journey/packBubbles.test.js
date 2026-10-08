import { describe, expect, it, vi } from 'vitest'
import { journey, skillTotals } from '../../content/journey'
import { bubbleFontPx } from './bubble'
import { packBubbles } from './packBubbles'

// These pack the whole journey's cloud at every scroll step, some of them
// twice. That's a third of a second here and up to eight on a CI runner
// sharing its cores with the other test files, so the default five-second
// limit was tripping on load, not on a hang.
vi.setConfig({ testTimeout: 30_000 })

const WIDTH = 320

// Sized the way the cloud estimates when it can't measure text.
function bubblesAfter(entryCount) {
  return skillTotals(journey.slice(0, entryCount)).map(({ skill, points }) => {
    const font = bubbleFontPx(points)
    return { key: skill, w: skill.length * font * 0.56 + font * 1.4, h: font * 1.9 }
  })
}

function overlappingPairs(bubbles, positions) {
  const pairs = []
  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {
      const a = bubbles[i]
      const b = bubbles[j]
      const pa = positions.get(a.key)
      const pb = positions.get(b.key)
      const overlapX = (a.w + b.w) / 2 - Math.abs(pa.x - pb.x)
      const overlapY = (a.h + b.h) / 2 - Math.abs(pa.y - pb.y)
      if (overlapX > 0.5 && overlapY > 0.5) pairs.push(`${a.key} / ${b.key}`)
    }
  }
  return pairs
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]

// How far each bubble in `previous` is from there in `positions`.
const moves = (previous, positions) =>
  [...previous].map(([key, before]) => {
    const after = positions.get(key)
    return Math.hypot(after.x - before.x, after.y - before.y)
  })

// Scrolls the whole journey one entry at a time, like a reader, each layout
// starting from the last.
function scrollThrough() {
  const steps = []
  let previous = new Map()
  for (let passed = 1; passed <= journey.length; passed++) {
    const bubbles = bubblesAfter(passed)
    const layout = packBubbles(bubbles, previous, WIDTH)
    steps.push({ bubbles, layout, previous })
    previous = layout.positions
  }
  return steps
}

describe('packBubbles', () => {
  it('never overlaps two bubbles at any point while scrolling the real journey', () => {
    for (const { bubbles, layout } of scrollThrough()) {
      expect(overlappingPairs(bubbles, layout.positions)).toEqual([])
    }
  })

  // However crowded, settling keeps going until nothing overlaps: a fixed
  // number of rounds once left crowded clouds with bubbles a pixel into each
  // other.
  it('settles until nothing overlaps, even with many bubbles crowded into a narrow column', () => {
    // 80 bubbles of varied, repeatable sizes, in a column a third narrower.
    // None wider than the column, as the cloud shrinks long names to fit.
    const crowd = Array.from({ length: 80 }, (_, index) => {
      const font = 9 + ((index * 7) % 13)
      const letters = 4 + ((index * 5) % 17)
      return { key: `skill-${index}`, w: Math.min(216, letters * font * 0.56 + font * 1.4), h: font * 1.9 }
    })

    const layout = packBubbles(crowd, new Map(), 220)

    expect(overlappingPairs(crowd, layout.positions)).toEqual([])
  })

  it('keeps every bubble inside the basket column', () => {
    for (const { bubbles, layout } of scrollThrough()) {
      for (const { key, w } of bubbles) {
        const { x } = layout.positions.get(key)
        expect(Math.abs(x) + w / 2).toBeLessThanOrEqual(WIDTH / 2 + 0.5)
      }
      expect(layout.width).toBeLessThanOrEqual(WIDTH + 0.5)
    }
  })

  // Drifting, not reshuffling. Measured against rebuilding each cloud from
  // scratch with the same bubbles, so the rule holds however many skills the
  // journey grows to: across the whole journey, the typical bubble moves less
  // than half as far as a rebuild would move it. (Ignoring where bubbles were
  // scores 1; the real journey is about a third. A single step can still move
  // a lot when a big card grows many skills at once, and that's fine.)
  it('lets existing bubbles drift instead of reshuffling across the whole journey', () => {
    let drifted = 0
    let rebuilt = 0
    for (const { bubbles, layout, previous } of scrollThrough().slice(1)) {
      drifted += median(moves(previous, layout.positions))
      rebuilt += median(moves(previous, packBubbles(bubbles, new Map(), WIDTH).positions))
    }

    expect(drifted / rebuilt).toBeLessThan(0.5)
  })

  it('anchors the biggest skill near the middle of the finished cloud', () => {
    const { bubbles, layout } = scrollThrough().at(-1)
    const biggest = bubbles.reduce((a, b) => (b.h > a.h ? b : a))
    const { x, y } = layout.positions.get(biggest.key)
    expect(Math.hypot(x, y)).toBeLessThan(Math.max(layout.width, layout.height) / 4)
  })

  it('gives the same cloud for the same bubbles and starting points', () => {
    const bubbles = bubblesAfter(journey.length)
    expect(packBubbles(bubbles, new Map(), WIDTH)).toEqual(packBubbles(bubbles, new Map(), WIDTH))
  })

  it('returns an empty cloud for no bubbles', () => {
    expect(packBubbles([], new Map(), WIDTH)).toEqual({ positions: new Map(), width: 0, height: 0 })
  })
})
