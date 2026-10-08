// Number formats for the fantasy pages. A missing value shows as an en dash.
export const MISSING = '–'

export function number(value, digits = 0) {
  if (value == null) return MISSING
  return value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

// A true minus sign, so signed columns line up.
export function signed(value, digits = 0) {
  if (value == null) return MISSING
  const text = number(Math.abs(value), digits)
  if (text === number(0, digits)) return text
  return `${value < 0 ? '−' : '+'}${text}`
}

export function percent(value) {
  if (value == null) return MISSING
  return `${signed(value * 100)}%`
}

// 'tabpfn(model_version=v2)' -> 'TabPFN v2'. The career model's backend, named for people.
export function backendName(backend) {
  if (!backend || /^xgb/.test(backend)) return 'gradient-boosted trees'
  if (/blend/.test(backend)) return 'trees and TabPFN, blended'
  if (/tabpfn/.test(backend)) return `TabPFN${/v2/.test(backend) ? ' v2' : ''}`
  return backend
}
