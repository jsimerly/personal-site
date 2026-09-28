export function formatRange(start, end) {
  return `${start} – ${end}`
}

const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

// '2021-11' -> 'Nov 2021'
export function formatMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number)
  return monthFormat.format(new Date(Date.UTC(year, month - 1, 1)))
}
