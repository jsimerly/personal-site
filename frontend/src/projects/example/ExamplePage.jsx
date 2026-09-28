import ApiState from '../../components/ApiState.jsx'
import { useApi } from '../../hooks/useApi'

export default function ExamplePage() {
  const items = useApi('/api/example/items/')

  return (
    <article>
      <h1 className="text-2xl font-semibold tracking-tight">Example project</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Loads <code className="text-sm">/api/example/items/</code> from the Django API. Copy this folder to start a new
        project.
      </p>

      <div className="mt-8">
        <ApiState state={items}>
          {(data) => (
            <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {data.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </ApiState>
      </div>
    </article>
  )
}
