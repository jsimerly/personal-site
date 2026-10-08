import ApiState from '../components/ApiState.jsx'
import { useApi } from '../hooks/useApi'
import { MISSING, number } from './format'
import { playerPath } from './settings'

// The row a player opens into: last season and this one so far, then every
// projected season with its value and the weight it gets at the chosen rate.
export default function PlayerDetail({ id, settings, inSeason, season }) {
  const state = useApi(playerPath(id, settings), { keepPrevious: true })
  return (
    <ApiState state={state.stale ? { data: state.data } : state}>
      {(player) => {
        const { facts } = player
        const first = player.spans[0]?.label
        const rows = [
          [facts.prev_label.replace('Pts', 'Points'), number(facts.prev_points, 0)],
          [facts.prev_label.replace('Pts', 'Games'), number(facts.prev_games, 0)],
          ...(inSeason ? [[`Games so far ’${String(season % 100).padStart(2, '0')}`, number(facts.td_games, 0)]] : []),
          [`Projected games, ${first}`, number(facts.h1_games, 1)],
          [`Projected points, ${first}`, number(facts.h1_points, 0)],
          ['Preseason value (points)', number(facts.preseason_value, 0)],
        ]
        return (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <dl className="text-sm">
              {rows.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 border-b border-dotted border-zinc-700 py-1">
                  <dt className="text-zinc-500">{term}</dt>
                  <dd className="text-zinc-200 tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="min-w-0">
              <div className="overflow-x-auto">
                <table className="text-right text-sm tabular-nums">
                  <caption className="sr-only">{`${player.name}, season by season`}</caption>
                  <thead>
                    <tr className="text-xs text-zinc-500">
                      <th scope="col" className="py-1 pr-3 text-left font-medium">Season</th>
                      <th scope="col" className="px-3 py-1 font-medium">Proj pts</th>
                      <th scope="col" className="px-3 py-1 font-medium">PPG (20th to 80th)</th>
                      <th scope="col" className="px-3 py-1 font-medium">PAR</th>
                      <th scope="col" className="px-3 py-1 font-medium">WAR</th>
                      <th scope="col" className="px-3 py-1 font-medium">Floor to ceiling</th>
                      <th scope="col" className="py-1 pl-3 font-medium">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player.spans.map((span) => (
                      <tr
                        key={span.label}
                        className={`border-t border-zinc-800 ${span.weight ? 'text-zinc-300' : 'text-zinc-600'}`}
                      >
                        <th scope="row" className="py-1 pr-3 text-left font-normal whitespace-nowrap">
                          {span.label}
                        </th>
                        <td className="px-3 py-1">{number(span.points, 0)}</td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {number(span.ppg, 1)}
                          {span.ppg_lo != null && (
                            <span className="text-zinc-500">
                              {' '}
                              ({number(span.ppg_lo, 1)}–{number(span.ppg_hi, 1)})
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-1">{number(span.par, 0)}</td>
                        <td className="px-3 py-1">{number(span.war, 2)}</td>
                        <td className="px-3 py-1 whitespace-nowrap">
                          {span.war_lo == null ? MISSING : `${number(span.war_lo, 2)}–${number(span.war_hi, 2)}`}
                        </td>
                        <td className="py-1 pl-3">{span.weight ? number(span.weight, 2) : '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">
                The PPG band is the career model&apos;s 20th to 80th percentile, where it has one, and floor to
                ceiling is the same spread in wins. Seasons past the horizon you chose carry no weight.
              </p>
            </div>
          </div>
        )
      }}
    </ApiState>
  )
}
