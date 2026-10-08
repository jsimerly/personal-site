import { useLayoutEffect, useRef, useState } from 'react'
import { niceTicks, spreadLabels } from './chart'

// A small line chart for the model page: the model in blue against gray
// baselines, each line named at its end and in the legend, with a crosshair
// that reads every series at the hovered point, and the same numbers as a
// table underneath for anyone who'd rather read them.
//
// series: [{ key, label, model?: true, dash?: 'dashed' | 'dotted' }]
// x / y:  { key?, title?, format(value), tick?(value) } (tick, for the axis)

const HEIGHT = 240
const MARGIN = { top: 14, right: 116, bottom: 40, left: 46 }
const DASHES = { dashed: '6 4', dotted: '1.5 4' }
const LABEL_GAP = 14

const colorOf = (series) => (series.model ? 'var(--color-model)' : 'var(--color-baseline)')

// The chart draws at its real width (so text stays legible on a phone),
// following the container as it resizes.
function useWidth(fallback) {
  const ref = useRef(null)
  const [width, setWidth] = useState(fallback)
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return [ref, width]
}

function Swatch({ series }) {
  return (
    <svg width="20" height="10" aria-hidden="true" className="shrink-0">
      <line
        x1="1"
        x2="19"
        y1="5"
        y2="5"
        stroke={colorOf(series)}
        strokeWidth="2"
        strokeDasharray={DASHES[series.dash]}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Legend({ series }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-zinc-400">
      {series.map((each) => (
        <li key={each.key} className="flex items-center gap-2">
          <Swatch series={each} />
          {each.label}
        </li>
      ))}
    </ul>
  )
}

export default function LineChart({ label, rows, x, y, series }) {
  const [ref, width] = useWidth(640)
  const [hover, setHover] = useState(null)

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 80)
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
  const xs = rows.map((row) => row[x.key])
  const values = rows.flatMap((row) => series.map((each) => row[each.key])).filter((value) => value != null)
  const ticks = niceTicks(Math.min(...values), Math.max(...values))
  const [xMin, xMax] = [Math.min(...xs), Math.max(...xs)]
  const [yMin, yMax] = [ticks[0], ticks.at(-1)]
  const left = (value) => MARGIN.left + (xMax === xMin ? plotWidth / 2 : ((value - xMin) / (xMax - xMin)) * plotWidth)
  const top = (value) => MARGIN.top + (1 - (value - yMin) / (yMax - yMin)) * plotHeight

  const lines = series.map((each) => ({
    ...each,
    points: rows.filter((row) => row[each.key] != null).map((row) => [left(row[x.key]), top(row[each.key])]),
  }))
  const ends = spreadLabels(
    lines.filter((line) => line.points.length).map((line) => ({ key: line.key, label: line.label, model: line.model, y: line.points.at(-1)[1] })),
    LABEL_GAP,
    MARGIN.top + plotHeight,
  )

  // The hovered point is the nearest x to the pointer.
  const onPointerMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    const pointer = event.clientX - box.left + MARGIN.left
    let nearest = 0
    xs.forEach((value, i) => {
      if (Math.abs(left(value) - pointer) < Math.abs(left(xs[nearest]) - pointer)) nearest = i
    })
    setHover(nearest)
  }
  const hovered = hover == null ? null : rows[hover]
  const tooltipLeft = hovered && left(hovered[x.key])

  return (
    <figure className="mt-4">
      <Legend series={series} />
      <div ref={ref} className="relative mt-3">
        <svg width={width} height={HEIGHT} role="img" aria-label={label} className="block max-w-full">
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={MARGIN.left} x2={MARGIN.left + plotWidth} y1={top(tick)} y2={top(tick)} stroke="var(--color-zinc-800)" />
              <text x={MARGIN.left - 8} y={top(tick)} dy="0.32em" textAnchor="end" className="fill-zinc-500 text-[11px] tabular-nums">
                {(y.tick ?? y.format)(tick)}
              </text>
            </g>
          ))}
          {xs.map((value) => (
            <text key={value} x={left(value)} y={MARGIN.top + plotHeight + 18} textAnchor="middle" className="fill-zinc-500 text-[11px]">
              {(x.tick ?? x.format)(value)}
            </text>
          ))}
          <text x={MARGIN.left + plotWidth / 2} y={HEIGHT - 4} textAnchor="middle" className="fill-zinc-500 text-[11px]">
            {x.title}
          </text>

          {hovered && (
            <line
              x1={tooltipLeft}
              x2={tooltipLeft}
              y1={MARGIN.top}
              y2={MARGIN.top + plotHeight}
              stroke="var(--color-zinc-600)"
              data-testid="crosshair"
            />
          )}
          {/* Gray lines first, so the model draws on top. */}
          {[...lines.filter((line) => !line.model), ...lines.filter((line) => line.model)].map((line) => (
            <g key={line.key}>
              <polyline
                points={line.points.map((point) => point.join(',')).join(' ')}
                fill="none"
                stroke={colorOf(line)}
                strokeWidth="2"
                strokeDasharray={DASHES[line.dash]}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {line.points.map(([cx, cy]) => (
                <circle key={cx} cx={cx} cy={cy} r="4" fill={colorOf(line)} stroke="var(--color-zinc-900)" strokeWidth="2" />
              ))}
            </g>
          ))}
          {ends.map((end) => (
            <text
              key={end.key}
              x={MARGIN.left + plotWidth + 10}
              y={end.y}
              dy="0.32em"
              className={`text-xs ${end.model ? 'fill-zinc-100 font-medium' : 'fill-zinc-400'}`}
            >
              {end.label}
            </text>
          ))}

          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            onPointerMove={onPointerMove}
            onPointerLeave={() => setHover(null)}
            data-testid="chart-hover"
          />
        </svg>

        {hovered && (
          <div
            role="tooltip"
            className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs shadow-lg"
            style={
              tooltipLeft > width / 2 ? { right: width - tooltipLeft + 12 } : { left: tooltipLeft + 12 }
            }
          >
            <p className="mb-1 font-medium text-zinc-100">{x.format(hovered[x.key])}</p>
            {[...series]
              .filter((each) => hovered[each.key] != null)
              .sort((a, b) => hovered[b.key] - hovered[a.key])
              .map((each) => (
                <p key={each.key} className="flex items-center gap-2 text-zinc-300">
                  <Swatch series={each} />
                  <span className="flex-1">{each.label}</span>
                  <span className="tabular-nums">{y.format(hovered[each.key])}</span>
                </p>
              ))}
          </div>
        )}
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-zinc-400 hover:text-zinc-200">Show as a table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-right tabular-nums">
            <caption className="sr-only">{label}</caption>
            <thead>
              <tr className="text-xs text-zinc-500">
                <th scope="col" className="py-1 pr-3 text-left font-medium">
                  {x.title}
                </th>
                {series.map((each) => (
                  <th key={each.key} scope="col" className="px-3 py-1 font-medium">
                    {each.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[x.key]} className="border-t border-zinc-800 text-zinc-300">
                  <th scope="row" className="py-1 pr-3 text-left font-normal">
                    {x.format(row[x.key])}
                  </th>
                  {series.map((each) => (
                    <td key={each.key} className="px-3 py-1">
                      {row[each.key] == null ? '–' : y.format(row[each.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
