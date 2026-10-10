import { IconChevronRight } from '@tabler/icons-react'
import { Fragment, useState } from 'react'
import PlayerDetail from './PlayerDetail.jsx'
import { MISSING, number, percent, signed } from './format'
import { sortRows } from './sort'

// The board: one row per player, columns grouped the way the dashboard groups
// them, sortable by any column. A player's name opens their season-by-season
// detail underneath. Rank and name stay pinned while the rest scrolls sideways.

function Position({ pos }) {
  return (
    <span className="inline-block min-w-8 rounded bg-zinc-800 px-1.5 py-px text-center text-[11px] font-semibold text-zinc-300">
      {pos}
    </span>
  )
}

// A diverging bar: cheap grows left of the middle in blue, rich right in red,
// capped at 100% either way. The percentage beside it is the reading.
export function Mispricing({ value }) {
  if (value == null) return <span className="text-zinc-500">{MISSING}</span>
  const reach = `${Math.min(Math.abs(value), 1) * 50}%`
  return (
    <span className="inline-flex items-center justify-end gap-2">
      <span aria-hidden="true" className="relative h-2 w-10 overflow-hidden rounded-sm bg-zinc-800">
        <span
          data-testid="mispricing-bar"
          className="absolute inset-y-0"
          style={
            value < 0
              ? { right: '50%', width: reach, background: 'var(--color-cheap)' }
              : { left: '50%', width: reach, background: 'var(--color-rich)' }
          }
        />
        <span className="absolute inset-y-0 left-1/2 w-px bg-zinc-600" />
      </span>
      <span className="w-10 text-right">{percent(value)}</span>
    </span>
  )
}

// Where a player's floor-to-ceiling band sits among everyone's.
function Range({ lo, hi, max }) {
  if (lo == null || hi == null) return <span className="text-zinc-500">{MISSING}</span>
  const at = (value) => `${Math.max(0, Math.min(100, (100 * value) / max))}%`
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="relative h-2 w-12 rounded-sm bg-zinc-800">
        <span
          className="absolute inset-y-0 min-w-0.5 rounded-sm"
          style={{ left: at(lo), right: `calc(100% - ${at(hi)})`, background: 'var(--color-model)' }}
        />
      </span>
      <span>
        {number(lo, 1)}–{number(hi, 1)}
      </span>
    </span>
  )
}

// `dir` is the direction a first click sorts: 1 ascending, -1 descending.
// A column's screen reader name is its group and label, unless it has a `name`.
function columnsFor(meta, maxHi) {
  const ros = 'Rest of season'
  return [
    { key: 'rank', label: '#', name: 'Rank', group: 'Player', dir: 1, cell: (row) => row.rank },
    { key: 'name', label: 'Player', group: 'Player', dir: 1, left: true },
    { key: 'pos', label: 'Pos', group: 'Player', dir: 1, left: true, cell: (row) => <Position pos={row.pos} /> },
    { key: 'age', label: 'Age', group: 'Player', dir: 1, cell: (row) => number(row.age, 0) },
    ...(meta.mode === 'inseason'
      ? [{ key: 'td_ppg', label: 'PPG so far', group: ros, dir: -1, cell: (row) => number(row.td_ppg, 1) }]
      : []),
    { key: 'h1_ppg', label: 'Proj PPG', group: ros, dir: -1, cell: (row) => number(row.h1_ppg, 1) },
    { key: 'par_ros', label: 'PAR', group: ros, dir: -1, cell: (row) => number(row.par_ros, 0) },
    { key: 'war_ros', label: 'WAR', group: ros, dir: -1, cell: (row) => number(row.war_ros, 2) },
    { key: 'war', label: 'WAR', group: 'Career', dir: -1, cell: (row) => number(row.war, 2) },
    {
      key: 'war_hi',
      label: 'Floor to ceiling',
      group: 'Career',
      dir: -1,
      cell: (row) => <Range lo={row.war_lo} hi={row.war_hi} max={maxHi} />,
    },
    { key: 'par', label: 'PAR', group: 'Career', dir: -1, cell: (row) => number(row.par, 0) },
    { key: 'market_rank', label: 'Mkt rank', group: 'Market', dir: 1, cell: (row) => number(row.market_rank) },
    { key: 'model_rank', label: 'Our rank', group: 'Market', dir: 1, cell: (row) => number(row.model_rank) },
    { key: 'rank_gap', label: 'Gap', group: 'Market', dir: 1, cell: (row) => signed(row.rank_gap) },
    { key: 'mis_pct', label: 'Mispricing', group: 'Market', dir: 1, cell: (row) => <Mispricing value={row.mis_pct} /> },
    {
      key: 'mis_pct_pos',
      label: 'vs position',
      group: 'Market',
      dir: 1,
      cell: (row) => <Mispricing value={row.mis_pct_pos} />,
    },
  ].map((column, i, all) => ({ ...column, first: i > 0 && all[i - 1].group !== column.group }))
}

const pinned = {
  rank: 'sticky left-0 z-10 w-12 min-w-12 max-w-12 bg-zinc-900',
  name: 'sticky left-12 z-10 bg-zinc-900',
}

export default function PlayerTable({ rows, maxHi, meta, settings, stale }) {
  const [sort, setSort] = useState({ key: 'rank', dir: 1 })
  const [open, setOpen] = useState(() => new Set())
  const columns = columnsFor(meta, maxHi)
  const groups = columns.reduce((runs, column) => {
    if (runs.at(-1)?.label === column.group) runs.at(-1).span += 1
    else runs.push({ label: column.group, span: 1 })
    return runs
  }, [])

  const toggle = (id) =>
    setOpen((was) => {
      const next = new Set(was)
      if (!next.delete(id)) next.add(id)
      return next
    })
  const sortBy = (column) =>
    setSort((was) => (was.key === column.key ? { key: column.key, dir: -was.dir } : { key: column.key, dir: column.dir }))

  const cellClass = (column) =>
    [
      'px-2 py-1.5 whitespace-nowrap border-b border-zinc-800 group-hover:bg-zinc-800',
      column.left ? 'text-left' : 'text-right',
      column.first ? 'border-l' : '',
      pinned[column.key] ?? '',
      column.key === settings.unit ? 'font-semibold text-zinc-50' : 'text-zinc-300',
    ].join(' ')

  return (
    <div
      aria-busy={stale}
      className={`max-h-[75vh] overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 transition-opacity ${stale ? 'opacity-60' : ''}`}
    >
      <table className="w-full border-separate border-spacing-0 text-sm tabular-nums">
        <caption className="sr-only">Player values</caption>
        <thead className="sticky top-0 z-20">
          <tr>
            {groups.map((group, i) => (
              <th
                key={group.label}
                scope="colgroup"
                colSpan={group.span}
                className={`bg-zinc-900 px-2 pt-2.5 text-center text-[11px] font-semibold tracking-widest text-zinc-500 uppercase ${i > 0 ? 'border-l border-zinc-800' : ''}`}
              >
                {group.label}
              </th>
            ))}
          </tr>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={sort.key === column.key ? (sort.dir > 0 ? 'ascending' : 'descending') : undefined}
                className={`border-b border-zinc-800 bg-zinc-900 px-2 py-2 align-bottom text-xs leading-tight font-medium text-zinc-400 ${column.left ? 'text-left' : 'text-right'} ${column.first ? 'border-l' : ''} ${pinned[column.key] ?? ''}`}
              >
                <button
                  type="button"
                  onClick={() => sortBy(column)}
                  aria-label={column.name ?? (column.group === 'Player' ? column.label : `${column.group} ${column.label}`)}
                  className={`cursor-pointer hover:text-zinc-100 ${sort.key === column.key ? 'text-zinc-100' : ''}`}
                >
                  {column.label}
                  <span aria-hidden="true" className="ml-0.5 inline-block w-2">
                    {sort.key === column.key ? (sort.dir > 0 ? '▴' : '▾') : ''}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortRows(rows, sort.key, sort.dir).map((row) => {
            const expanded = open.has(row.id)
            return (
              <Fragment key={row.id}>
                <tr className="group">
                  {columns.map((column) =>
                    column.key === 'name' ? (
                      <td key="name" className={cellClass(column)}>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`detail-${row.id}`}
                          onClick={() => toggle(row.id)}
                          className="inline-flex cursor-pointer items-center gap-1 font-medium text-zinc-100 hover:text-accent-400"
                        >
                          <IconChevronRight
                            size={14}
                            aria-hidden="true"
                            className={`text-zinc-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
                          />
                          {row.name}
                        </button>
                        {row.team && <span className="ml-1.5 text-[11px] text-zinc-500">{row.team}</span>}
                      </td>
                    ) : (
                      <td key={column.key} className={cellClass(column)}>
                        {column.cell(row)}
                      </td>
                    ),
                  )}
                </tr>
                {expanded && (
                  <tr id={`detail-${row.id}`}>
                    <td colSpan={columns.length} className="border-b border-zinc-800 bg-zinc-950/60 p-0">
                      <div className="sticky left-0 max-w-[min(64rem,calc(100vw-3rem))] px-4 py-4">
                        <PlayerDetail
                          id={row.id}
                          settings={settings}
                          inSeason={meta.mode === 'inseason'}
                          season={meta.season}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
