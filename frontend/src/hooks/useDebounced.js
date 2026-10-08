import { useEffect, useState } from 'react'

// The value, once it has held still for `ms`. For a slider that would
// otherwise send a request on every step of a drag.
export function useDebounced(value, ms) {
  const [settled, setSettled] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms)
    return () => clearTimeout(timer)
  }, [value, ms])
  return settled
}
