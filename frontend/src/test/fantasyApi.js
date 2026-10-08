// Canned responses from the fantasy analysis API (api/apps/fantasy_analysis),
// shaped exactly as it answers. Made-up players.
export const PLAYERS = '/api/fantasy-analysis/players/'
export const MODEL = '/api/fantasy-analysis/model/'

const row = (fields) => ({
  team: null,
  td_ppg: null,
  h1_ppg: null,
  war_lo: null,
  war_hi: null,
  priced: true,
  liquid: true,
  market_rank: null,
  model_rank: null,
  rank_gap: null,
  mis_pct: null,
  mis_pct_pos: null,
  ...fields,
})

// In page order, which isn't rank order. By default (priced and not fringe)
// the board shows Blake Rivers, Avery Stone, then Casey Field.
export const rows = [
  row({
    id: 'avery-stone-qb', name: 'Avery Stone', pos: 'QB', team: 'KC', age: 26.1, rank: 2,
    td_ppg: 17.7, h1_ppg: 17.2, par_ros: 150.2, war_ros: 1.444, par: 672.8, war: 6.469, war_lo: 4.01, war_hi: 9.121,
    market_rank: 1, model_rank: 2, rank_gap: 1, mis_pct: 0.047, mis_pct_pos: 0,
  }),
  row({
    id: 'blake-rivers-rb', name: 'Blake Rivers', pos: 'RB', team: 'DET', age: 23.4, rank: 1,
    td_ppg: 19.7, h1_ppg: 19.1, par_ros: 189.7, war_ros: 1.824, par: 767.2, war: 7.377, war_lo: 4.574, war_hi: 10.403,
    market_rank: 2, model_rank: 1, rank_gap: -1, mis_pct: -0.302, mis_pct_pos: -0.1,
  }),
  row({
    id: 'casey-field-wr', name: 'Casey Field', pos: 'WR', team: 'MIA', age: 29.8, rank: 3,
    td_ppg: 12.5, h1_ppg: 13.1, par_ros: 60.4, war_ros: 0.581, par: 301.9, war: 2.904, war_lo: 1.2, war_hi: 4.4,
    market_rank: 3, model_rank: 3, rank_gap: 0, mis_pct: 1.4, mis_pct_pos: 0.426,
  }),
  row({
    id: 'drew-lake-te', name: 'Drew Lake', pos: 'TE', age: 31, rank: 4,
    td_ppg: 8.2, h1_ppg: 9.0, par_ros: 12.5, war_ros: 0.12, par: 80.3, war: 0.772, war_lo: 0.3, war_hi: 1.1,
    liquid: false, market_rank: 4, model_rank: 4, rank_gap: 0, mis_pct: 0, mis_pct_pos: 0,
  }),
  row({
    id: 'emery-hill-wr', name: 'Emery Hill', pos: 'WR', team: 'SEA', age: 22, rank: 5,
    par_ros: 0, war_ros: 0, par: 40.1, war: 0.384, priced: false, liquid: false,
  }),
]

export const leagues = [
  {
    id: 'home', name: 'Home League', teams: 10,
    slots: { QB: 1, RB: 2, WR: 3, TE: 1, FLEX: 1, SUPER_FLEX: 1 },
    starters: { QB: 20, RB: 26, WR: 36, TE: 12 },
    replacement: { QB: 13.4, RB: 8.9, WR: 9.5, TE: 7.2 },
    curve: { mean: 121.4, sd: 23.1, n: 1560, per10: 0.352 },
    note: "the model is trained on this league's scoring", primary: true,
  },
  {
    id: 'office', name: 'Office League', teams: 12,
    slots: { QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1 },
    starters: { QB: 12, RB: 30, WR: 28, TE: 14 },
    replacement: { QB: 16.8, RB: 9.1, WR: 9.2, TE: 8.6 },
    curve: { mean: 117.9, sd: 21.4, n: 980, per10: 0.37 },
    note: '', primary: false,
  },
]

export const meta = {
  as_of: 'in-season, 2026 through week 4', run_date: '2026-10-07', season: 2026, week: 4, mode: 'inseason',
  career_backend: 'tabpfn(model_version=v2)', labels: ['ROS ’26', '’27', '’28'], prev_label: 'Pts ’25',
  n: 5, n_priced: 4,
}

export function players(settings = {}, changes = {}) {
  return {
    meta,
    leagues,
    settings: { rate: 0.2, years: 10, unit: 'war', market: 'ktc', fair: 'rank', league: 'home', ...settings },
    rows,
    ...changes,
  }
}

export const averyStone = {
  id: 'avery-stone-qb',
  name: 'Avery Stone',
  facts: {
    prev_label: 'Pts ’25', prev_points: 297.6, prev_games: 16, td_games: 4, h1_games: 13,
    h1_points: 223.6, preseason_value: 646.9,
  },
  spans: [
    { label: 'ROS ’26', points: 223.6, ppg: 17.2, ppg_lo: null, ppg_hi: null, par: 150.2, war: 1.444, war_lo: 0.895, war_hi: 2.036, weight: 1 },
    { label: '’27', points: 297.6, ppg: 18.6, ppg_lo: 13.7, ppg_hi: 23.6, par: 177.8, war: 1.71, war_lo: 1.06, war_hi: 2.411, weight: 0.8 },
    { label: '’28', points: 304, ppg: 19, ppg_lo: 13.9, ppg_hi: 24.1, par: 187.7, war: 1.806, war_lo: null, war_hi: null, weight: 0 },
  ],
}

const experiment = (i, value) => ({
  name: `variant_${i}`, n_features: 40 + i, horizon: 3, cohorts: '2015-2022', spearman_war_all: 0.6,
  mae_war_top: 0.5, spearman_iv_vs_realized: value, spearman_ktc_vs_realized: 0.664, edge_corr: 0.3,
})

export const model = {
  run_date: '2026-10-07',
  career_backend: 'tabpfn(model_version=v2)',
  spearman_vs_market: 0.9314,
  career: {
    start_season: 2010,
    mae: [
      { horizon: 1, model: 34.2032, decay: 36.0938, carry_forward: 38.2966, 'model_%_vs_carry': 10.7, 'model_%_vs_decay': 5.2, n_total: 8502, folds: 15 },
      { horizon: 5, model: 29.0876, decay: 31.6101, carry_forward: 57.8385, 'model_%_vs_carry': 49.7, 'model_%_vs_decay': 8, n_total: 6096, folds: 11 },
    ],
  },
  value: {
    horizon: 3,
    first_cohort: 2020,
    discount_rate: 0.2,
    mean: { spearman_iv_vs_realized: 0.6687, spearman_ktc_vs_realized: 0.6638, spearman_blend_vs_realized: 0.6844, spearman_iv_vs_ktc: 0.8942 },
    bootstrap: { iv_minus_ktc: 0.0052, ci90_lo: -0.0678, ci90_hi: 0.0758 },
    per_cohort: [
      { cohort_T: 2020, n_players: 91, spearman_iv_vs_realized: 0.6866, spearman_ktc_vs_realized: 0.7089, spearman_blend_vs_realized: 0.7169 },
      { cohort_T: 2021, n_players: 115, spearman_iv_vs_realized: 0.6559, spearman_ktc_vs_realized: 0.6298, spearman_blend_vs_realized: 0.6568 },
    ],
    terciles: [
      { tercile: 'fairly priced', n: 121, mean_beat_market_by: -6.7687 },
      { tercile: 'market rich vs IV', n: 121, mean_beat_market_by: -7.0043 },
      { tercile: 'market cheap vs IV', n: 124, mean_beat_market_by: 13.451 },
    ],
  },
  inseason: {
    cohorts: '2021-2024',
    ros: [
      { W: 3, n: 681, 'ros|model': 0.7836, 'ros|ktc': 0.7044, 'ros|last_season': 0.6, 'ros|to_date': 0.7004, 'ros|blend': 0.7564 },
      { W: 13, n: 751, 'ros|model': 0.6921, 'ros|ktc': 0.5664, 'ros|last_season': 0.4703, 'ros|to_date': 0.6686, 'ros|blend': 0.6737 },
    ],
  },
  market: {
    cohorts: '2020-2024',
    overall: [
      { variant: 'xgb', horizon: 1, n: 857, rho_model: 0.6242, rho_ktc: 0.6124, edge_corr: 0.3209, cheap_gap_real: 17.5088, rich_gap_real: -15.338 },
      { variant: 'xgb', horizon: 3, n: 366, rho_model: 0.6854, rho_ktc: 0.6776, edge_corr: 0.3194, cheap_gap_real: 11.8595, rich_gap_real: -9.4504 },
    ],
    by_position: [
      { variant: 'xgb', horizon: 3, n: 73, rho_model: 0.6786, rho_ktc: 0.609, edge_corr: 0.4106, cheap_gap_real: 17.7714, rich_gap_real: -6.2647, position: 'RB' },
      { variant: 'xgb', horizon: 3, n: 82, rho_model: 0.6199, rho_ktc: 0.6651, edge_corr: 0.2824, cheap_gap_real: 10.1765, rich_gap_real: -8.9348, position: 'QB' },
      { variant: 'xgb', horizon: 1, n: 163, rho_model: 0.6028, rho_ktc: 0.6385, edge_corr: 0.4523, cheap_gap_real: 17.625, rich_gap_real: -21.3382, position: 'QB' },
    ],
  },
  // Twelve: eleven scored 0.690 down to 0.680, and one never scored on value.
  experiments: [
    experiment(12, null),
    ...Array.from({ length: 11 }, (_, i) => experiment(i + 1, Number((0.69 - i / 1000).toFixed(3)))),
  ],
}
