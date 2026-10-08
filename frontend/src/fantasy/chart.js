// The arithmetic behind LineChart, kept apart from it.

// Round numbers for the y axis, about `count` steps between min and max.
export function niceTicks(min, max, count = 4) {
  const raw = (max - min || Math.abs(max) || 1) / count
  const power = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((multiple) => multiple * power).find((candidate) => candidate >= raw)
  const low = Math.floor(min / step) * step
  // At least two ticks, so the axis has a height to scale against.
  const high = Math.max(Math.ceil(max / step) * step, low + step)
  const ticks = []
  for (let value = low; value <= high + step / 2; value += step) ticks.push(Number(value.toFixed(10)))
  return ticks
}

// End-of-line labels pushed apart so none overlap, keeping their order.
export function spreadLabels(labels, gap, bottom) {
  const placed = [...labels].sort((a, b) => a.y - b.y).map((label) => ({ ...label }))
  placed.forEach((label, i) => {
    if (i > 0 && label.y - placed[i - 1].y < gap) label.y = placed[i - 1].y + gap
  })
  const overflow = placed.length ? placed.at(-1).y - bottom : 0
  return overflow > 0 ? placed.map((label) => ({ ...label, y: label.y - overflow })) : placed
}
