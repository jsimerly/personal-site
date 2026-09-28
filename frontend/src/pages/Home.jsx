import { Link } from 'react-router'
import { projects } from '../projects'

export default function Home() {
  return (
    <>
      <section>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Jacob Simerly</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">A home for the projects I build.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium tracking-wide text-zinc-500 uppercase">Projects</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                to={`/projects/${project.slug}`}
                className="block h-full rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <h3 className="font-medium">{project.name}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{project.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
