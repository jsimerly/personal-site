import { useSearchParams } from 'react-router'
import ProjectCard from '../components/ProjectCard.jsx'
import { KIND_LABELS, listedProjects } from '../projects'

const FILTERS = [{ kind: 'all', label: 'All' }, ...Object.entries(KIND_LABELS).map(([kind, label]) => ({ kind, label }))]

export default function Projects() {
  // The filter lives in the URL (?kind=career), so a filtered view can be shared.
  const [params, setParams] = useSearchParams()
  const active = params.get('kind') ?? 'all'
  const shown = listedProjects.filter((project) => active === 'all' || project.kind === active)
  const countFor = (kind) =>
    kind === 'all' ? listedProjects.length : listedProjects.filter((project) => project.kind === kind).length

  return (
    <>
      <title>Projects | Jacob Simerly</title>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        Everything I&apos;ve built at work and on my own, big or small.
      </p>

      <div role="group" aria-label="Filter projects" className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map(({ kind, label }) => (
          <button
            key={kind}
            type="button"
            aria-pressed={active === kind}
            onClick={() => setParams(kind === 'all' ? {} : { kind }, { replace: true })}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-300 aria-pressed:border-zinc-900 aria-pressed:bg-zinc-900 aria-pressed:text-white dark:border-zinc-800 dark:text-zinc-300 dark:aria-pressed:border-white dark:aria-pressed:bg-white dark:aria-pressed:text-zinc-900"
          >
            {label} <span className="ml-1 opacity-60">{countFor(kind)}</span>
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </>
  )
}
