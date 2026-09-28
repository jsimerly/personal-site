import { describe, expect, it } from 'vitest'
import { journey, skillTotals } from '../../content/journey'
import { bubbleFontPx } from './bubble'
import { packBubbles } from './packBubbles'

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

  it('keeps every bubble inside the basket column', () => {
    for (const { bubbles, layout } of scrollThrough()) {
      for (const { key, w } of bubbles) {
        const { x } = layout.positions.get(key)
        expect(Math.abs(x) + w / 2).toBeLessThanOrEqual(WIDTH / 2 + 0.5)
      }
      expect(layout.width).toBeLessThanOrEqual(WIDTH + 0.5)
    }
  })

  it('lets existing bubbles drift a little instead of reshuffling when one more joins', () => {
    const [, second, third] = scrollThrough().slice(-3)
    for (const { key } of second.bubbles) {
      const before = second.layout.positions.get(key)
      const after = third.layout.positions.get(key)
      expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeLessThan(120)
    }
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
