import { useApi } from '../hooks/useApi'

// Doubles as the warm-up ping. Every page renders it, so Cloud Run starts
// waking the moment someone lands, before they open a project that needs data.
export default function ApiStatus() {
  const { loading, slow, error } = useApi('/api/health/')

  let label = 'API online'
  let dot = 'bg-emerald-500'
  if (error) {
    label = 'API offline'
    dot = 'bg-red-500'
  } else if (loading) {
    label = slow ? 'Waking up the API' : 'Checking the API'
    dot = 'animate-pulse bg-amber-400'
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
