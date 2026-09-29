// Packs word bubbles into a loose, round-ish cloud.
//
// Each bubble starts where it was last time (so the cloud drifts rather than
// reshuffling when a skill grows or joins) or, if it's new, on a sunflower
// spiral out from the middle. Then two phases:
//   1. Gather: bubbles are squeezed toward the center while any two that
//      overlap are pushed apart along the line between them. This gives the
//      cloud its loose, organic shape.
//   2. Settle: no more squeezing; overlapping pairs are pushed apart along
//      whichever axis clears them fastest, until nothing overlaps. The cloud
//      grows taller rather than cramming.
// Pure: the same bubbles and starting points always give the same cloud.
const GAP = 5
const GATHER_STEPS = 160
// Settling goes on until nothing overlaps. The cap only guards against a
// cloud that can't come apart, which shouldn't happen: it can always grow
// taller.
const MAX_SETTLE_STEPS = 2000
// How hard bubbles are pulled toward the middle each step. Pulling harder
// sideways than vertically keeps the cloud narrow enough for its column.
const SQUEEZE_X = 0.04
const SQUEEZE_Y = 0.02
const GOLDEN_ANGLE = 2.39996

// items: [{ key, w, h }]. previous: Map key -> { x, y } from the last layout.
// Returns positions of bubble centers relative to the cloud's center, and the
// cloud's size.
export function packBubbles(items, previous = new Map(), maxWidth = Infinity) {
  const nodes = items.map((item, index) => {
    const before = previous.get(item.key)
    const angle = index * GOLDEN_ANGLE
    const radius = 12 * Math.sqrt(index)
    return {
      ...item,
      x: before?.x ?? Math.cos(angle) * radius,
      y: before?.y ?? Math.sin(angle) * radius,
      angle,
    }
  })

  const limitFor = (node) => Math.max(0, maxWidth / 2 - node.w / 2)
  // Can this bubble still move sideways in this direction, or is it against
  // the column's edge?
  const canSlide = (node, direction) =>
    direction > 0 ? node.x < limitFor(node) - 0.01 : node.x > -limitFor(node) + 0.01

  // One round of pushing overlapping pairs apart. Returns how many overlapped.
  const separate = (settling) => {
    let overlapping = 0
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const first = nodes[a]
        const second = nodes[b]
        const dx = second.x - first.x
        const dy = second.y - first.y
        const overlapX = (first.w + second.w) / 2 + GAP - Math.abs(dx)
        const overlapY = (first.h + second.h) / 2 + GAP - Math.abs(dy)
        if (overlapX <= 0 || overlapY <= 0) continue
        overlapping += 1

        // Heavier (bigger) bubbles hold their ground; lighter ones give way.
        const firstShare = second.mass / (first.mass + second.mass)
        const secondShare = 1 - firstShare

        if (settling) {
          // Clear the overlap along the cheaper axis, unless a bubble is
          // pinned against the column's edge; then go vertical.
          const direction = dx >= 0 ? 1 : -1
          const sideways = canSlide(first, -direction) && canSlide(second, direction)
          if (overlapX < overlapY && sideways) {
            first.x -= direction * overlapX * firstShare
            second.x += direction * overlapX * secondShare
          } else {
            const vertical = dy >= 0 ? 1 : -1
            first.y -= vertical * overlapY * firstShare
            second.y += vertical * overlapY * secondShare
          }
          continue
        }
        // Push apart along the line between centers (organic, not gridded).
        // Coincident centers split along the newer bubble's spiral angle.
        const distance = Math.hypot(dx, dy)
        const ux = distance ? dx / distance : Math.cos(second.angle)
        const uy = distance ? dy / distance : Math.sin(second.angle)
        const push = Math.min(overlapX, overlapY)
        first.x -= ux * push * firstShare
        first.y -= uy * push * firstShare
        second.x += ux * push * secondShare
        second.y += uy * push * secondShare
      }
    }
    for (const node of nodes) {
      const limit = limitFor(node)
      node.x = Math.min(limit, Math.max(-limit, node.x))
    }
    return overlapping
  }

  // Bigger bubbles pull harder toward the middle and are heavier when pushed,
  // so the strongest skills anchor the cloud and small ones gather around.
  const tallest = Math.max(...nodes.map((node) => node.h), 1)
  for (const node of nodes) {
    const size = node.h / tallest
    node.pull = 0.4 + size ** 2
    node.mass = size ** 4
  }

  for (let step = 0; step < GATHER_STEPS; step++) {
    for (const node of nodes) {
      node.x -= node.x * SQUEEZE_X * node.pull
      node.y -= node.y * SQUEEZE_Y * node.pull
    }
    separate(false)
  }
  for (let step = 0; step < MAX_SETTLE_STEPS && separate(true); step++) {
    // Keep settling while anything still overlaps.
  }

  if (!nodes.length) return { positions: new Map(), width: 0, height: 0 }

  // Center the cloud on its bounding box.
  const left = Math.min(...nodes.map((node) => node.x - node.w / 2))
  const right = Math.max(...nodes.map((node) => node.x + node.w / 2))
  const top = Math.min(...nodes.map((node) => node.y - node.h / 2))
  const bottom = Math.max(...nodes.map((node) => node.y + node.h / 2))
  const shiftX = (left + right) / 2
  const shiftY = (top + bottom) / 2

  return {
    positions: new Map(nodes.map((node) => [node.key, { x: node.x - shiftX, y: node.y - shiftY }])),
    width: right - left,
    height: bottom - top,
  }
}
