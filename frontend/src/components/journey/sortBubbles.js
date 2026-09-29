// Lays the bubbles out in labeled rows, one per kind of skill: the label on
// the left, that kind's bubbles flowing to its right (biggest first), wrapping
// onto more lines as needed, with a divider between kinds. Positions are
// bubble centers relative to the layout's center, the same as packBubbles, so
// bubbles can glide between the cloud and the rows. Pure.
export const LABEL_WIDTH = 170
const GAP_X = 8
const GAP_Y = 8
const SECTION_GAP = 18
const OTHER = 'Other'

// bubbles: [{ key, w, h }]. categories: [{ name, skills }].
export function sortBubbles(bubbles, categories, width) {
  const kindOf = new Map(categories.flatMap(({ name, skills }) => skills.map((skill) => [skill, name])))
  const sections = [...categories.map(({ name }) => name), OTHER]
    .map((name) => ({
      name,
      items: bubbles
        .filter((bubble) => (kindOf.get(bubble.key) ?? OTHER) === name)
        .sort((a, b) => b.h - a.h || a.key.localeCompare(b.key)),
    }))
    .filter(({ items }) => items.length)

  const placed = new Map()
  const labels = []
  const dividers = []
  let top = 0

  sections.forEach(({ name, items }, section) => {
    if (section > 0) dividers.push({ section, y: top - SECTION_GAP / 2 })
    const lines = [[]]
    let x = LABEL_WIDTH
    for (const item of items) {
      if (x + item.w > width && lines.at(-1).length) {
        lines.push([])
        x = LABEL_WIDTH
      }
      lines.at(-1).push({ item, left: x })
      x += item.w + GAP_X
    }

    lines.forEach((line, index) => {
      const lineHeight = Math.max(...line.map(({ item }) => item.h))
      if (index === 0) labels.push({ name, section, x: 0, y: top + lineHeight / 2 })
      for (const { item, left } of line) {
        placed.set(item.key, { section, x: left + item.w / 2, y: top + lineHeight / 2 })
      }
      top += lineHeight + (index < lines.length - 1 ? GAP_Y : 0)
    })
    top += SECTION_GAP
  })

  const height = Math.max(0, top - SECTION_GAP)
  const toCenter = ({ x, y, ...rest }) => ({ ...rest, x: x - width / 2, y: y - height / 2 })
  return {
    positions: new Map([...placed].map(([key, point]) => [key, toCenter(point)])),
    labels: labels.map(toCenter),
    // Lines between kinds, each tagged with the row just below it.
    dividers: dividers.map(({ section, y }) => ({ section, y: y - height / 2 })),
    sections: sections.length,
    width,
    height,
  }
}

// How far one row has assembled (0 to 1) at a point in the sort (0 to 1).
// Rows take turns, top to bottom: each gets a ROW_WINDOW-long slice of the
// sort, the slices overlapping so the next row starts before the last one
// lands, and each row eases in and out of place.
export const ROW_WINDOW = 0.4

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export function rowProgress(sortProgress, section, sections) {
  const start = sections > 1 ? ((1 - ROW_WINDOW) * section) / (sections - 1) : 0
  return easeInOut(Math.min(1, Math.max(0, (sortProgress - start) / ROW_WINDOW)))
}
