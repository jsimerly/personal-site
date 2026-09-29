import { useLayoutEffect, useState } from 'react'

// Where each piece of the timeline goes, top to bottom, so a job and a
// personal project from the same stretch sit side by side instead of one
// under the other.
//
// Each lane (a side of the spine, or the one column on a phone) stacks its
// own cards without overlap. Every entry starts at least STAGGER below the
// one before it, whichever side that was on, so the timeline still reads in
// order, and scrolling past an entry still means scrolling past every earlier
// one (the basket collects by that). Each year's marker starts below
// everything before it, and that year's entries start below the marker.
export const GAP = 24
export const STAGGER = 20
export const YEAR_GAP = 40
export const AFTER_YEAR = 24

// items, in timeline order: { key, kind: 'year' | 'entry', lane, height }.
// Returns each item's top (key -> px) and the height of the whole timeline.
// Pure.
export function layoutTimeline(items) {
  const tops = new Map()
  const free = new Map() // lane -> the first y a card there can start at
  let floor = 0 // the earliest the next entry may start
  let height = 0

  for (const item of items) {
    let top
    if (item.kind === 'year') {
      top = tops.size ? height + YEAR_GAP : 0
      floor = top + item.height + AFTER_YEAR
      free.clear()
    } else {
      top = Math.max(floor, free.get(item.lane) ?? floor)
      free.set(item.lane, top + item.height + GAP)
      floor = top + STAGGER
    }
    tops.set(item.key, top)
    height = Math.max(height, top + item.height)
  }
  return { tops, height }
}

// Two sides from md up (the cards' grid); one column below it.
const TWO_SIDES = '(min-width: 48rem)'

const sameLayout = (a, b) => a.height === b.height && [...b.tops].every(([key, top]) => a.tops.get(key) === top)

// Measures the timeline's pieces (marked data-layout-key, data-layout-kind,
// and data-lane) inside `listRef` and lays them out, again whenever a piece
// or the page changes size.
export function useTimelineLayout(listRef) {
  const [layout, setLayout] = useState(() => ({ tops: new Map(), height: 0 }))

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    const measure = () => {
      const twoSides = window.matchMedia?.(TWO_SIDES).matches ?? true
      const pieces = [...list.querySelectorAll('[data-layout-key]')]
      const next = layoutTimeline(
        pieces.map((piece) => ({
          key: piece.dataset.layoutKey,
          kind: piece.dataset.layoutKind,
          lane: twoSides ? piece.dataset.lane : 'one',
          height: piece.offsetHeight,
        })),
      )
      setLayout((previous) => (sameLayout(previous, next) ? previous : next))
    }

    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    list.querySelectorAll('[data-layout-key]').forEach((piece) => observer.observe(piece))
    return () => observer.disconnect()
  }, [listRef])

  return layout
}
