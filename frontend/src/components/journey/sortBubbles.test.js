import { describe, expect, it } from 'vitest'
import { LABEL_WIDTH, rowProgress, sortBubbles } from './sortBubbles'

const CATEGORIES = [
  { name: 'Languages', skills: ['Python', 'Rust', 'SQL'] },
  { name: 'Frontend', skills: ['React', 'CSS'] },
]

const bubble = (key, h, w = 60) => ({ key, w, h })

describe('sortBubbles', () => {
  it('stacks one labeled row per kind of skill, in category order, skipping empty kinds', () => {
    const layout = sortBubbles([bubble('React', 20), bubble('Python', 30)], [...CATEGORIES, { name: 'Empty', skills: [] }], 600)

    expect(layout.labels.map(({ name }) => name)).toEqual(['Languages', 'Frontend'])
    expect(layout.positions.get('Python').y).toBeLessThan(layout.positions.get('React').y)
  })

  it('puts the biggest skill of each kind first, right after the label', () => {
    const layout = sortBubbles([bubble('Rust', 16), bubble('Python', 30), bubble('SQL', 22)], CATEGORIES, 600)
    const xs = ['Python', 'SQL', 'Rust'].map((key) => layout.positions.get(key).x)

    expect(xs).toEqual([...xs].sort((a, b) => a - b))
    expect(layout.positions.get('Python').x - 30).toBeCloseTo(LABEL_WIDTH - 300)
  })

  it('files skills it has no kind for under Other, last', () => {
    const layout = sortBubbles([bubble('Juggling', 20), bubble('Python', 20)], CATEGORIES, 600)

    expect(layout.labels.map(({ name }) => name)).toEqual(['Languages', 'Other'])
  })

  it('wraps a long row onto more lines and never overlaps or leaves the width', () => {
    const wide = ['Python', 'Rust', 'SQL'].map((key) => bubble(key, 20, 180))
    const layout = sortBubbles(wide, CATEGORIES, 500)
    const boxes = wide.map(({ key, w, h }) => ({ ...layout.positions.get(key), w, h }))

    expect(new Set(boxes.map(({ y }) => y)).size).toBeGreaterThan(1)
    for (const box of boxes) expect(box.x + box.w / 2).toBeLessThanOrEqual(250)
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const [a, b] = [boxes[i], boxes[j]]
        const apart = Math.abs(a.x - b.x) >= (a.w + b.w) / 2 || Math.abs(a.y - b.y) >= (a.h + b.h) / 2
        expect(apart).toBe(true)
      }
    }
  })

  it('tags each bubble and label with its row, top to bottom', () => {
    const layout = sortBubbles([bubble('React', 20), bubble('Python', 30)], CATEGORIES, 600)

    expect(layout.positions.get('Python').section).toBe(0)
    expect(layout.positions.get('React').section).toBe(1)
    expect(layout.labels.map(({ section }) => section)).toEqual([0, 1])
    expect(layout.sections).toBe(2)
  })

  it('draws a divider between each pair of kinds, halfway through the gap', () => {
    const layout = sortBubbles([bubble('Python', 30), bubble('React', 20), bubble('Juggling', 20)], CATEGORIES, 600)
    const [first, second] = layout.dividers

    expect(layout.dividers.map(({ section }) => section)).toEqual([1, 2])
    expect(first.y).toBeGreaterThan(layout.positions.get('Python').y + 15)
    expect(first.y).toBeLessThan(layout.positions.get('React').y - 10)
    expect(second.y).toBeLessThan(layout.positions.get('Juggling').y - 10)
  })

  it('is centered on its own middle, like the cloud', () => {
    const layout = sortBubbles([bubble('Python', 30), bubble('React', 20)], CATEGORIES, 600)
    const ys = [...layout.positions.values()].map(({ y }) => y)

    expect(Math.min(...ys) - 15).toBeCloseTo(-layout.height / 2)
    expect(layout.labels[0].x).toBe(-300)
  })
})

describe('rowProgress', () => {
  it('holds every row in the cloud before the sort starts and in place once it ends', () => {
    for (const section of [0, 3, 6]) {
      expect(rowProgress(0, section, 7)).toBe(0)
      expect(rowProgress(1, section, 7)).toBe(1)
    }
  })

  it('assembles rows in turn, top to bottom', () => {
    const early = [0, 1, 2, 3, 4, 5, 6].map((section) => rowProgress(0.3, section, 7))

    expect(early).toEqual([...early].sort((a, b) => b - a))
    expect(early[0]).toBeGreaterThan(0.5)
    expect(early[6]).toBe(0)
  })

  it('only ever moves a row forward as the sort advances', () => {
    let last = 0
    for (let step = 0; step <= 100; step++) {
      const now = rowProgress(step / 100, 3, 7)
      expect(now).toBeGreaterThanOrEqual(last)
      last = now
    }
  })
})
