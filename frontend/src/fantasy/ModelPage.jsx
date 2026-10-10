import { useId, useState } from 'react'
import ApiState from '../components/ApiState.jsx'
import { sectionLabel } from '../components/ui'
import { useApi } from '../hooks/useApi'
import DataTable from './DataTable.jsx'
import LineChart from './LineChart.jsx'
import { backendName, number, signed } from './format'
import { MODEL_PATH } from './settings'

const rho = (value) => number(value, 3)
const VARIANTS = { xgb: 'Trees', tabpfn: 'TabPFN', blend: 'Blend' }
const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE']
const SHORT_LIST = 10

function Tile({ label, value, children }) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <p id={id} className={sectionLabel}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 tabular-nums">{value}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-400">{children}</p>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
      {children}
    </section>
  )
}

// What a test predicts, what it's scored on, and against what.
function Spec({ items }) {
  return (
    <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[max-content_1fr]">
      {items.map(([term, detail]) => (
        <div key={term} className="contents">
          <dt className="font-medium text-zinc-300">{term}</dt>
          <dd className="text-zinc-400">{detail}</dd>
        </div>
      ))}
    </dl>
  )
}

const callOf = (tercile) => (/cheap/.test(tercile) ? 'Called cheap' : /rich/.test(tercile) ? 'Called rich' : 'Fairly priced')
const CALLS = ['Called cheap', 'Fairly priced', 'Called rich']

function Headlines({ model }) {
  const ros = model.inseason.ros[0]
  const { mean, horizon } = model.value
  const cheap = model.value.terciles.find((row) => callOf(row.tercile) === 'Called cheap')
  const far = model.career.mae.at(-1)
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ros && (
        <Tile label="Rest of season" value={rho(ros['ros|model'])}>
          Rank agreement with how players finished the season, from a week {ros.W} snapshot. The market scores{' '}
          {rho(ros['ros|ktc'])}.
        </Tile>
      )}
      <Tile label={`${horizon}-year value`} value={rho(mean.spearman_iv_vs_realized)}>
        Rank agreement with the value players delivered over the next {horizon} seasons, against{' '}
        {rho(mean.spearman_ktc_vs_realized)} for the market. Blending the two scores{' '}
        {rho(mean.spearman_blend_vs_realized)}.
      </Tile>
      {cheap && (
        <Tile label="Called cheap" value={signed(cheap.mean_beat_market_by, 1)}>
          Ranks better than the market had them, on average, for the third of players the model said were too
          cheap.
        </Tile>
      )}
      {far && (
        <Tile label="Projection error" value={`${number(far['model_%_vs_carry'], 0)}%`}>
          Less error than repeating last season, {far.horizon} seasons out ({number(far.model, 1)} points a season
          against {number(far.carry_forward, 1)}).
        </Tile>
      )}
    </div>
  )
}

export default function ModelPage() {
  const state = useApi(MODEL_PATH)
  const [allExperiments, setAllExperiments] = useState(false)

  return (
    <>
      <title>Model performance | Fantasy Data Engineering & Machine Learning | Jacob Simerly</title>
      <ApiState state={state}>
        {(model) => {
          const longest = Math.max(...model.market.overall.map((row) => row.horizon))
          const experiments = [...model.experiments].sort(
            (a, b) => (b.spearman_iv_vs_realized ?? -1) - (a.spearman_iv_vs_realized ?? -1),
          )
          return (
            <>
              <p className="max-w-3xl leading-7 text-zinc-400">
                Every test is a backtest on seasons the model never saw: for each season, it trains only on the
                seasons before, projects the players, and is scored against what they went on to do. The market
                (KeepTradeCut) is scored the same way on the same players, as the bar to clear. Nothing from the
                market goes into the model.
              </p>
              <p className="mt-3 text-sm text-zinc-500">
                Run {model.run_date} · career model {backendName(model.career_backend)} · this week the model and
                the market agree at {rho(model.spearman_vs_market)}
              </p>

              <Headlines model={model} />

              <div className="mt-8 space-y-6">
                {model.inseason.ros.length > 0 && (
                  <Card title="Rest of this season, from a mid-season snapshot">
                    <Spec
                      items={[
                        ['Predicts', "Each player's points per game for the rest of the season, from their season so far and last season."],
                        ['Scored on', `Seasons ${model.inseason.cohorts}: players the market priced that week who played again.`],
                        ['Measure', 'Rank agreement (Spearman) with what they actually averaged. 1 is the same order.'],
                        ['Baselines', "The market's ranking that week, this season's scoring so far, and last season's."],
                      ]}
                    />
                    <LineChart
                      label="Rest-of-season rank agreement by snapshot week"
                      rows={model.inseason.ros}
                      x={{ key: 'W', title: 'Snapshot week', format: (week) => `Week ${week}`, tick: (week) => `Wk ${week}` }}
                      y={{ format: rho, tick: (value) => number(value, 2) }}
                      series={[
                        { key: 'ros|model', label: 'Model', model: true },
                        { key: 'ros|ktc', label: 'Market (KTC)' },
                        { key: 'ros|to_date', label: 'Season so far', dash: 'dashed' },
                        { key: 'ros|last_season', label: 'Last season', dash: 'dotted' },
                      ]}
                    />
                  </Card>
                )}

                {model.career.mae.length > 0 && (
                  <Card title="Career projections, season by season">
                    <Spec
                      items={[
                        ['Predicts', "Each player's fantasy points in each of the next five seasons."],
                        ['Scored on', `Walk-forward folds from ${model.career.start_season}: train on earlier seasons, predict the ones after.`],
                        ['Measure', 'Average miss in points per season. Lower is better.'],
                        ['Baselines', 'Last season repeated, and last season scaled by how players of that position and age usually change.'],
                      ]}
                    />
                    <LineChart
                      label="Projection error by seasons ahead"
                      rows={model.career.mae}
                      x={{
                        key: 'horizon',
                        title: 'Seasons ahead',
                        format: (h) => `${h} season${h === 1 ? '' : 's'} ahead`,
                        tick: (h) => `+${h}`,
                      }}
                      y={{ format: (value) => `${number(value, 1)} pts`, tick: (value) => number(value, 0) }}
                      series={[
                        { key: 'model', label: 'Model', model: true },
                        { key: 'decay', label: 'Age curve', dash: 'dashed' },
                        { key: 'carry_forward', label: 'Last season', dash: 'dotted' },
                      ]}
                    />
                  </Card>
                )}

                <Card title={`${model.value.horizon}-year value, from a season-end projection`}>
                  <Spec
                    items={[
                      ['Predicts', `Each player's value over the next ${model.value.horizon} seasons, from where they stand at season's end.`],
                      ['Scored on', `Cohorts from ${model.value.first_cohort}: every player the market priced the following February.`],
                      ['Measure', 'Rank agreement with the value they actually delivered.'],
                      ['Baselines', 'The market that February, and a 50/50 blend of the two rankings.'],
                    ]}
                  />
                  <DataTable
                    caption={`${model.value.horizon}-year value rank agreement by cohort`}
                    columns={[
                      { key: 'cohort_T', label: 'Cohort' },
                      { key: 'n_players', label: 'Players' },
                      { key: 'spearman_iv_vs_realized', label: 'Model', format: rho },
                      { key: 'spearman_ktc_vs_realized', label: 'Market', format: rho },
                      { key: 'spearman_blend_vs_realized', label: '50/50 blend', format: rho },
                    ]}
                    rows={[...model.value.per_cohort, { cohort_T: 'Mean', ...model.value.mean }]}
                    best={['spearman_iv_vs_realized', 'spearman_ktc_vs_realized', 'spearman_blend_vs_realized']}
                  />
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Model minus market, bootstrapped over players: {signed(model.value.bootstrap.iv_minus_ktc, 3)}, with a
                    90% interval of {signed(model.value.bootstrap.ci90_lo, 3)} to{' '}
                    {signed(model.value.bootstrap.ci90_hi, 3)}. An interval across zero is a statistical tie.
                  </p>
                  {model.value.terciles.length > 0 && (
                    <>
                      <h3 className="mt-6 text-sm font-semibold text-zinc-200">Does the mispricing pay?</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        Players split into thirds by how far the market&apos;s price sat from the model&apos;s, then followed: how
                        many ranks better than their market rank they finished.
                      </p>
                      <DataTable
                        caption="Mispricing thirds and how they finished"
                        columns={[
                          { key: 'call', label: 'Third' },
                          { key: 'n', label: 'Players' },
                          { key: 'mean_beat_market_by', label: 'Finished better by', format: (value) => signed(value, 1) },
                        ]}
                        rows={model.value.terciles
                          .map((row) => ({ ...row, call: callOf(row.tercile) }))
                          .sort((a, b) => CALLS.indexOf(a.call) - CALLS.indexOf(b.call))}
                      />
                    </>
                  )}
                </Card>

                {model.market.overall.length > 0 && (
                  <Card title="Against the market">
                    <Spec
                      items={[
                        ['Scored on', `Cohorts ${model.market.cohorts}, in wins above replacement for my league.`],
                        ['Edge', "Does disagreeing with the market pay? Rank correlation between the model's gap to the market and how far players then beat their market rank."],
                        ['Cheap, rich', 'The third the model liked most and least next to the market: ranks better than their market rank they finished, on average.'],
                      ]}
                    />
                    <DataTable
                      caption="Model against the market, by model and horizon"
                      columns={[
                        { key: 'label', label: 'Model' },
                        { key: 'n', label: 'Players' },
                        { key: 'rho_model', label: 'Model', format: rho },
                        { key: 'rho_ktc', label: 'Market', format: rho },
                        { key: 'edge_corr', label: 'Edge', format: rho },
                        { key: 'cheap_gap_real', label: 'Cheap', format: (value) => signed(value, 1) },
                        { key: 'rich_gap_real', label: 'Rich', format: (value) => signed(value, 1) },
                      ]}
                      rows={[...model.market.overall]
                        .sort((a, b) => a.variant.localeCompare(b.variant) || b.horizon - a.horizon)
                        .map((row) => ({ ...row, label: `${VARIANTS[row.variant] ?? row.variant}, ${row.horizon} yr` }))}
                      best={['rho_model', 'rho_ktc']}
                    />
                    <h3 className="mt-6 text-sm font-semibold text-zinc-200">By position, {longest} years out</h3>
                    <DataTable
                      caption={`Model against the market by position, ${longest} years out`}
                      columns={[
                        { key: 'label', label: 'Position' },
                        { key: 'n', label: 'Players' },
                        { key: 'rho_model', label: 'Model', format: rho },
                        { key: 'rho_ktc', label: 'Market', format: rho },
                        { key: 'edge_corr', label: 'Edge', format: rho },
                        { key: 'cheap_gap_real', label: 'Cheap', format: (value) => signed(value, 1) },
                        { key: 'rich_gap_real', label: 'Rich', format: (value) => signed(value, 1) },
                      ]}
                      rows={model.market.by_position
                        .filter((row) => row.horizon === longest)
                        .sort(
                          (a, b) =>
                            a.variant.localeCompare(b.variant) ||
                            POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position),
                        )
                        .map((row) => ({ ...row, label: `${VARIANTS[row.variant] ?? row.variant}, ${row.position}` }))}
                      best={['rho_model', 'rho_ktc']}
                    />
                  </Card>
                )}

                {experiments.length > 0 && (
                  <Card title="Experiments">
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Every model variant I&apos;ve tried, on the same {experiments[0].horizon}-year backtest, best first.
                      Features is how many inputs it sees; value is its rank agreement with what players delivered.
                    </p>
                    <DataTable
                      caption="Model experiments"
                      columns={[
                        { key: 'name', label: 'Experiment' },
                        { key: 'n_features', label: 'Features' },
                        { key: 'cohorts', label: 'Cohorts' },
                        { key: 'spearman_iv_vs_realized', label: 'Value', format: rho },
                        { key: 'spearman_ktc_vs_realized', label: 'Market', format: rho },
                        { key: 'edge_corr', label: 'Edge', format: rho },
                      ]}
                      rows={allExperiments ? experiments : experiments.slice(0, SHORT_LIST)}
                      best={['spearman_iv_vs_realized', 'spearman_ktc_vs_realized']}
                    />
                    {experiments.length > SHORT_LIST && (
                      <button
                        type="button"
                        onClick={() => setAllExperiments(!allExperiments)}
                        className="mt-3 cursor-pointer text-sm font-medium text-accent-400 hover:text-accent-100"
                      >
                        {allExperiments ? 'Show the top 10' : `Show all ${experiments.length}`}
                      </button>
                    )}
                  </Card>
                )}
              </div>
            </>
          )
        }}
      </ApiState>
    </>
  )
}
