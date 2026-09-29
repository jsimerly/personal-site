export function formatRange(start, end) {
  return `${start} – ${end}`
}

const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

// '2021-11' -> 'Nov 2021'. A year alone ('2016'), for when the month isn't
// known, stays a year.
export function formatMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number)
  if (!month) return String(year)
  return monthFormat.format(new Date(Date.UTC(year, month - 1, 1)))
}
