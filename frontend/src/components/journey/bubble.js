import { journey, skillTotals } from '../../content/journey'

// How a skill's bubble looks for its running total.
//
// Size: points so far, against the most any skill ever holds at any point in
// the journey, so that peak moment is full size. SIZE_CURVE at 1 is strictly
// proportional; lower lifts the small skills. MAX_FONT_PX caps the biggest
// bubble: past about 20px a long name becomes a slab that crowds the cloud.
// A shrunk skill (negative numbers) never drops below MIN_POINTS, so it stays
// in the basket.
//
// Color: a spectrum set by how much of a skill's growth came from each side.
// All work is blue, all building is red, an even split is purple, and
// everything between blends along blue -> purple -> red by its share.
export const SIZE_CURVE = 0.85
export const MIN_FONT_PX = 8.5
export const MAX_FONT_PX = 20
export const MIN_POINTS = 0.5

export const PEAK_POINTS = Math.max(
  1,
  ...journey.flatMap((_, index) => skillTotals(journey.slice(0, index + 1)).map(({ points }) => points)),
)

export function bubbleLevel(points) {
  return (Math.min(PEAK_POINTS, Math.max(MIN_POINTS, points)) / PEAK_POINTS) ** SIZE_CURVE
}

export function bubbleFontPx(points) {
  return MIN_FONT_PX + bubbleLevel(points) * (MAX_FONT_PX - MIN_FONT_PX)
}

export function skillColor({ work, build }) {
  const total = work + build
  const workShare = total ? work / total : 0
  // Past the even split, blend purple toward blue; before it, toward red.
  const [side, towardSide] =
    workShare >= 0.5 ? ['var(--color-work)', (workShare - 0.5) * 2] : ['var(--color-build)', (0.5 - workShare) * 2]
  return `color-mix(in oklch, ${side} ${Math.round(towardSide * 100)}%, var(--color-both))`
}

// Background and outline for a bubble, flat: bigger skills are a little
// richer, never loud (the biggest tops out at a 40% tint).
export function bubbleColors(total) {
  const color = skillColor(total)
  const level = bubbleLevel(total.points)
  return {
    backgroundColor: `color-mix(in oklab, ${color} ${Math.round(20 + level * 20)}%, var(--color-zinc-950))`,
    boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 60%, transparent)`,
    opacity: 0.8 + level * 0.2,
  }
}

// Once the basket has sorted itself into rows, readability wins: a narrower
// size range (still bigger for stronger skills) and one purple for the skills
// that stick around (content/skillCategories.js), which also never drop below
// LASTING_MIN_FONT_PX. Every other skill fades back: smaller, grey, unfilled.
export const SORTED_MIN_FONT_PX = 12
export const SORTED_MAX_FONT_PX = 17
export const LASTING_MIN_FONT_PX = 14

export function sortedFontPx(points, lasting = true) {
  if (!lasting) return SORTED_MIN_FONT_PX
  return Math.max(LASTING_MIN_FONT_PX, SORTED_MIN_FONT_PX + bubbleLevel(points) * (SORTED_MAX_FONT_PX - SORTED_MIN_FONT_PX))
}

export const SORTED_COLORS = {
  backgroundColor: 'color-mix(in oklab, var(--color-both) 24%, var(--color-zinc-950))',
  boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--color-both) 55%, transparent)',
  opacity: 1,
}

// Faded, not see-through: the bubbles are buttons, so their text keeps AA
// contrast (zinc-500 on the page); the fill and color go instead.
export const FADED_COLORS = {
  backgroundColor: 'transparent',
  boxShadow: 'inset 0 0 0 1px var(--color-zinc-700)',
  color: 'var(--color-zinc-500)',
  opacity: 1,
}

// A skill picked to find its projects: brighter, with a light ring.
export const PICKED_COLORS = {
  backgroundColor: 'color-mix(in oklab, var(--color-both) 55%, var(--color-zinc-950))',
  boxShadow: 'inset 0 0 0 1px color-mix(in oklab, white 70%, transparent)',
  opacity: 1,
}

// The mobile tray's chips.
export function bubbleStyle(total) {
  return { ...bubbleColors(total), fontSize: `${bubbleFontPx(total.points)}px` }
}
