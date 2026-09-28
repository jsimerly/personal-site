// Shared loading, cold-start, and error states for anything backed by useApi.
// `children` is a function that receives the loaded data.
export default function ApiState({ state, children }) {
  if (state.error) {
    return (
      <p role="alert" className="text-red-600 dark:text-red-400">
        {"Couldn't load this. Try again in a moment."}
      </p>
    )
  }
  if (state.loading) {
    return (
      <p className="text-zinc-500">
        {state.slow ? 'Waking up the server. The first load after a quiet spell takes a few seconds.' : 'Loading…'}
      </p>
    )
  }
  return children(state.data)
}
