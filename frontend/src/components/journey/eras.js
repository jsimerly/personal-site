// Stretches of the timeline spent at one place (a school or a company), for
// the faint rails down the formal side's margin. An era starts at the first
// entry with a given `org` and runs until that place's `end` date passes or
// the next place begins, whichever comes first. `until` is the index of the
// first entry past the era. Pure.
export function erasOf(entries) {
  const starts = []
  entries.forEach((entry, index) => {
    if (entry.side === 'work' && entry.org && entry.org !== starts.at(-1)?.org) {
      starts.push({ org: entry.org, start: index, end: entry.end })
    }
  })

  return starts.map((era, order) => {
    const nextPlace = starts[order + 1]?.start ?? entries.length
    const ended =
      era.end && era.end !== 'now'
        ? entries.findIndex((entry, index) => index > era.start && entry.date > era.end)
        : -1
    return { org: era.org, start: era.start, until: ended === -1 ? nextPlace : Math.min(ended, nextPlace) }
  })
}
