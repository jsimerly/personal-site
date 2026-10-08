// The dashboard's controls, named as the API names them
// (api/apps/fantasy_analysis/views.py). They live in the page's URL, so a
// link opens on the same view; only the ones moved off their default appear.
export const DEFAULTS = { league: '', unit: 'war', rate: 0.2, years: 10, market: 'ktc', fair: 'rank' }

export const UNITS = [
  { value: 'war', label: 'Career WAR (wins)' },
  { value: 'war_ros', label: 'Rest-of-season WAR' },
  { value: 'par', label: 'Career PAR (points)' },
  { value: 'par_ros', label: 'Rest-of-season PAR' },
]

export const MARKETS = [
  { value: 'ktc', label: 'KTC dynasty (SF)' },
  { value: 'fc', label: 'FantasyCalc dynasty (SF)' },
  { value: 'rd_sf', label: 'KTC redraft (SF)' },
  { value: 'rd_1qb', label: 'KTC redraft (1QB)' },
]

export const FAIR_METHODS = [
  { value: 'rank', label: 'Rank match' },
  { value: 'curve', label: 'Curve fit' },
]

export const YEARS = [1, 3, 5, 7, 10]

const ORDER = ['league', 'unit', 'rate', 'years', 'market', 'fair']
const among = (options, value) => options.some((option) => option.value === value)

// Anything in the URL that isn't a valid choice falls back to the default.
export function readSettings(params) {
  const rate = Number(params.get('rate'))
  const years = Number(params.get('years'))
  return {
    league: params.get('league') ?? DEFAULTS.league,
    unit: among(UNITS, params.get('unit')) ? params.get('unit') : DEFAULTS.unit,
    rate: params.has('rate') && rate >= 0 && rate <= 1 ? Math.round(rate * 100) / 100 : DEFAULTS.rate,
    years: YEARS.includes(years) ? years : DEFAULTS.years,
    market: among(MARKETS, params.get('market')) ? params.get('market') : DEFAULTS.market,
    fair: among(FAIR_METHODS, params.get('fair')) ? params.get('fair') : DEFAULTS.fair,
  }
}

// The settings that differ from the defaults, in a fixed order.
export function settingsQuery(settings, keys = ORDER) {
  const query = new URLSearchParams()
  for (const key of keys) {
    if (settings[key] !== DEFAULTS[key]) query.set(key, String(settings[key]))
  }
  return query.toString()
}

const withQuery = (path, query) => (query ? `${path}?${query}` : path)

export const playersPath = (settings) => withQuery('/api/fantasy-analysis/players/', settingsQuery(settings))

// A player's seasons depend only on the league and how the years are weighted.
export const playerPath = (id, settings) =>
  withQuery(`/api/fantasy-analysis/players/${id}/`, settingsQuery(settings, ['league', 'rate', 'years']))

export const MODEL_PATH = '/api/fantasy-analysis/model/'
