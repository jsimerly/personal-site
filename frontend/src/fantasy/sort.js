// Missing values sort last whichever way the column runs.
export function sortRows(rows, key, dir) {
  return [...rows].sort((a, b) => {
    const [x, y] = [a[key], b[key]]
    if (x == null || y == null) return (x == null) - (y == null)
    return (typeof x === 'string' ? x.localeCompare(y) : x - y) * dir
  })
}
