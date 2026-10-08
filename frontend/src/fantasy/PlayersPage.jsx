import { useId, useState } from 'react'
import { useSearchParams } from 'react-router'
import ApiState from '../components/ApiState.jsx'
import { useApi } from '../hooks/useApi'
import { useDebounced } from '../hooks/useDebounced'
import PlayerTable from './PlayerTable.jsx'
import { backendName, number } from './format'
import { FAIR_METHODS, MARKETS, UNITS, YEARS, playersPath, readSettings, settingsQuery } from './settings'

// How long the controls hold still before the board refetches.
export const SETTLE_MS = 250
const POSITIONS = ['All', 'QB', 'RB', 'WR', 'TE']

const control =
  'rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500'

// A labelled control. The label points at the control rather than wrapping
// it, so the control's name is just the label, not its current value too.
function Field({ label, id, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  )
}

function Choice({ label, value, options, onChange }) {
  const id = useId()
  return (
    <Field label={label} id={id}>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={control}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

function Controls({ settings, leagues, league, update }) {
  const percent = Math.round(settings.rate * 100)
  const rateId = useId()
  return (
    <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
      <Choice
        label="League"
        value={league}
        options={leagues.map((each) => ({ value: each.id, label: each.name }))}
        onChange={(value) => update({ league: value })}
      />
      <Choice label="Rank by" value={settings.unit} options={UNITS} onChange={(value) => update({ unit: value })} />
      <Field label="Discount rate" id={rateId}>
        <span className="flex h-[34px] items-center gap-3">
          <input
            id={rateId}
            type="range"
            min="0"
            max="100"
            step="5"
            value={percent}
            aria-valuetext={`${percent}% a year`}
            onChange={(event) => update({ rate: Number(event.target.value) / 100 })}
            className="w-32 accent-(--color-model)"
          />
          <output className="min-w-22 text-sm whitespace-nowrap text-zinc-100 tabular-nums">{percent}% a year</output>
        </span>
      </Field>
      <Choice
        label="Years"
        value={String(settings.years)}
        options={YEARS.map((years) => ({ value: String(years), label: String(years) }))}
        onChange={(value) => update({ years: Number(value) })}
      />
      <Choice label="Market" value={settings.market} options={MARKETS} onChange={(value) => update({ market: value })} />
      <Choice label="Fair price" value={settings.fair} options={FAIR_METHODS} onChange={(value) => update({ fair: value })} />
    </div>
  )
}

// The league's shape, since replacement level and the win curve are its own.
function LeagueNote({ league }) {
  const slots = Object.entries(league.slots ?? {})
    .map(([slot, count]) => `${count} ${slot === 'SUPER_FLEX' ? 'superflex' : slot}`)
    .join(', ')
  const replacement = Object.entries(league.replacement ?? {})
    .map(([pos, points]) => `${pos} ${number(points, 1)}`)
    .join(', ')
  return (
    <p className="mt-4 max-w-4xl text-sm leading-6 text-zinc-500">
      <span className="font-medium text-zinc-300">{league.name}</span>: {league.teams} teams starting {slots}.
      Replacement level, in points a week: {replacement}. Ten more points a week is worth about{' '}
      {number(league.curve.per10, 2)} wins a week to an average team.
      {league.note && ` ${league.note[0].toUpperCase()}${league.note.slice(1)}.`}
    </p>
  )
}

function Filters({ filters, setFilters, shown, total }) {
  const set = (change) => setFilters({ ...filters, ...change })
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
      <input
        type="search"
        value={filters.query}
        onChange={(event) => set({ query: event.target.value })}
        placeholder="Search players"
        aria-label="Search players"
        className={`${control} w-full sm:w-56`}
      />
      <div role="group" aria-label="Position" className="flex gap-1.5">
        {POSITIONS.map((position) => (
          <button
            key={position}
            type="button"
            aria-pressed={filters.position === position}
            onClick={() => set({ position })}
            className="cursor-pointer rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 hover:border-zinc-500 aria-pressed:border-zinc-100 aria-pressed:bg-zinc-100 aria-pressed:text-zinc-900"
          >
            {position}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={filters.priced} onChange={(event) => set({ priced: event.target.checked })} />
        Priced only
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={filters.liquid} onChange={(event) => set({ liquid: event.target.checked })} />
        Skip fringe players
      </label>
      <p className="text-sm text-zinc-500 sm:ml-auto" aria-live="polite">
        {shown} of {total} players
      </p>
    </div>
  )
}

function Key() {
  const swatch = (color) => (
    <span aria-hidden="true" className="inline-block h-2 w-3 rounded-sm" style={{ background: `var(--color-${color})` }} />
  )
  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-500">
      <li className="flex items-center gap-2">{swatch('cheap')} Market cheap next to the model</li>
      <li className="flex items-center gap-2">{swatch('rich')} Market rich next to the model</li>
      <li>Gap: our rank minus the market&apos;s, so negative means we like them more</li>
      <li>Click a name for their season-by-season projection</li>
    </ul>
  )
}

function HowItWorks() {
  return (
    <details className="mt-8 max-w-3xl rounded-lg border border-zinc-800 px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-zinc-200">How the values work</summary>
      <div className="mt-3 space-y-3 text-sm leading-6 text-zinc-400">
        <p>
          Each player&apos;s projected points become <b className="text-zinc-200">wins above replacement (WAR)</b> for
          the league you pick. Replacement level is the best player left once every lineup is filled from players
          who actually suit up that week, so injuries and byes push it deeper than the last starter. Points above it
          (PAR) turn into wins through the league&apos;s own win curve.
        </p>
        <p>
          The rest of this season counts in full, and each later season is discounted at the rate you choose, out to
          the number of years you choose. Nothing from the market goes into the value.
        </p>
        <p>
          <b className="text-zinc-200">Fair price</b> is what the market would pay if it agreed with the model. Rank
          match lines players up by value and by price, so the player we rank tenth gets the tenth-highest price.
          Curve fit draws one smooth line through every value and price, and reads each player&apos;s price off it.
        </p>
        <p>
          <b className="text-zinc-200">Mispricing</b> is how far the market&apos;s price sits from that fair price,
          across all positions; vs position compares within each position. The prices themselves stay behind the
          scenes: this page shows only ranks and percentages.
        </p>
      </div>
    </details>
  )
}

function Board({ data, settings, update, stale }) {
  const [filters, setFilters] = useState({ query: '', position: 'All', priced: true, liquid: true })
  const league = data.leagues.find((each) => each.id === data.settings.league)
  const market = MARKETS.find((each) => each.value === data.settings.market)
  const query = filters.query.trim().toLowerCase()
  const shown = data.rows.filter(
    (row) =>
      (filters.position === 'All' || row.pos === filters.position) &&
      (!query || row.name.toLowerCase().includes(query)) &&
      (!filters.priced || row.priced) &&
      (!filters.liquid || row.liquid),
  )
  const maxHi = Math.max(1e-9, ...data.rows.map((row) => row.war_hi ?? 0))

  return (
    <>
      <p className="mb-6 text-sm text-zinc-500">
        {data.meta.as_of} · run {data.meta.run_date} · {data.meta.n} players, {data.meta.n_priced} priced by{' '}
        {market.label} · career model {backendName(data.meta.career_backend)}
      </p>
      <Controls settings={settings} leagues={data.leagues} league={settings.league || data.settings.league} update={update} />
      {league && <LeagueNote league={league} />}
      <Filters filters={filters} setFilters={setFilters} shown={shown.length} total={data.rows.length} />
      <div className="mt-4">
        <PlayerTable rows={shown} maxHi={maxHi} meta={data.meta} settings={data.settings} stale={stale} />
      </div>
      <Key />
      <HowItWorks />
    </>
  )
}

export default function PlayersPage() {
  const [params, setParams] = useSearchParams()
  const settings = readSettings(params)
  const board = useApi(useDebounced(playersPath(settings), SETTLE_MS), { keepPrevious: true })
  const update = (change) => setParams(settingsQuery({ ...settings, ...change }), { replace: true })

  return (
    <>
      <title>Player values | Fantasy Analysis | Jacob Simerly</title>
      <ApiState state={board.stale ? { data: board.data } : board}>
        {(data) => <Board data={data} settings={settings} update={update} stale={board.stale} />}
      </ApiState>
    </>
  )
}
