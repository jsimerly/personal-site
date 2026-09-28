import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'

// Cloud Run scales to zero, so the first request after a quiet spell waits on
// a cold start. Past this point the UI explains the wait instead of hanging.
export const SLOW_AFTER_MS = 2500

export function useApi(path) {
  // Each update records the path it belongs to, so a result for a previous
  // path reads as "still loading" instead of showing the wrong data.
  const [state, setState] = useState({})

  useEffect(() => {
    const controller = new AbortController()
    const settle = (result) => {
      if (!controller.signal.aborted) setState({ path, done: true, ...result })
    }
    const slowTimer = setTimeout(() => setState({ path, slow: true }), SLOW_AFTER_MS)

    apiGet(path, { signal: controller.signal })
      .then((data) => settle({ data }))
      .catch((error) => settle({ error }))
      .finally(() => clearTimeout(slowTimer))

    return () => {
      controller.abort()
      clearTimeout(slowTimer)
    }
  }, [path])

  const current = state.path === path ? state : {}
  return {
    data: current.data ?? null,
    error: current.error ?? null,
    loading: !current.done,
    slow: Boolean(current.slow),
  }
}
