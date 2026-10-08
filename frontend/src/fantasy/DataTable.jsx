// A plain numbers table for the model page. The first column names the row.
// `best` bolds, in each row, whichever of those columns did best (`lower`
// when smaller is better, like an error).
//
// columns: [{ key, label, format?(value, row) }]
export default function DataTable({ caption, columns, rows, best, lower = false }) {
  const [first, ...rest] = columns
  const winner = (row) => {
    const scores = (best ?? []).map((key) => row[key]).filter((value) => value != null)
    return scores.length ? (lower ? Math.min : Math.max)(...scores) : null
  }
  const show = (column, row) => (row[column.key] == null ? '–' : (column.format ?? String)(row[column.key], row))

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-right text-sm tabular-nums">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-xs text-zinc-500">
            {columns.map((column, i) => (
              <th key={column.key} scope="col" className={`py-1.5 font-medium ${i === 0 ? 'pr-3 text-left' : 'px-3'}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const top = winner(row)
            return (
              <tr key={index} className="border-t border-zinc-800 text-zinc-300">
                <th scope="row" className="py-1.5 pr-3 text-left font-normal whitespace-nowrap">
                  {show(first, row)}
                </th>
                {rest.map((column) => (
                  <td
                    key={column.key}
                    className={`px-3 py-1.5 ${best?.includes(column.key) && row[column.key] === top ? 'font-semibold text-zinc-50' : ''}`}
                  >
                    {show(column, row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
