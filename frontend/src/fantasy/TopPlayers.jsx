import { Link } from 'react-router'
import ApiState from '../components/ApiState.jsx'
import { sectionLabel, textLink } from '../components/ui'
import { useApi } from '../hooks/useApi'
import { number } from './format'
import { DEFAULTS, playersPath } from './settings'

const SHOWN = 5

// A live taste of the board for the Portfolio: this week's top players by
// career wins above replacement, with a way into the full section.
export default function TopPlayers() {
  const state = useApi(playersPath(DEFAULTS))
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
      <ApiState state={state}>
        {(data) => {
          const top = [...data.rows].sort((a, b) => a.rank - b.rank).slice(0, SHOWN)
          const league = data.leagues.find((each) => each.id === data.settings.league)
          return (
            <>
              <p className={sectionLabel}>Top {SHOWN} this week</p>
              <p className="mt-1 text-sm text-zinc-500">
                Career wins above replacement in {league?.name}, {data.meta.as_of}
              </p>
              <ol aria-label="Top players" className="mt-4 space-y-3">
                {top.map((player) => (
                  <li key={player.id} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.5rem] items-center gap-x-3">
                    <span className="text-sm text-zinc-500 tabular-nums">{player.rank}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-zinc-100">
                        {player.name} <span className="text-xs font-normal text-zinc-500">{player.pos}</span>
                      </span>
                      <span aria-hidden="true" className="mt-1 block h-1.5 rounded-sm bg-zinc-800">
                        <span
                          className="block h-full rounded-sm"
                          style={{ width: `${(100 * player.war) / top[0].war}%`, background: 'var(--color-model)' }}
                        />
                      </span>
                    </span>
                    <span className="text-right text-sm text-zinc-200 tabular-nums">{number(player.war, 2)}</span>
                  </li>
                ))}
              </ol>
              <Link to="/fantasy-analysis" className={`mt-5 inline-block text-sm ${textLink}`}>
                See all {data.meta.n} players
              </Link>
            </>
          )
        }}
      </ApiState>
    </div>
  )
}
