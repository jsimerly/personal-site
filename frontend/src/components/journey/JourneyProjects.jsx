import { IconArrowRight } from '@tabler/icons-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { listedProjects } from '../../projects'
import ProjectCard from '../ProjectCard.jsx'
import { textLink } from '../ui'
import { listOf, relevantProjects } from './related'

// The projects right after the skills, compact enough that skills and
// projects fit on one screen together: three favorites until skills are
// picked above, then the three most relevant to them. A single hint line
// guides; the journey's dashed line runs in from the skills.
export default function JourneyProjects({ picked, onClear }) {
  const shown = useMemo(() => relevantProjects(listedProjects, picked), [picked])

  return (
    <section aria-label="Projects" className="mx-auto flex max-w-5xl flex-col items-center">
      <span aria-hidden="true" className="hidden h-8 border-l-2 border-dashed border-zinc-700 lg:block" />
      <div className="mt-10 flex w-full items-baseline justify-between gap-4 text-sm lg:mt-3">
        <p aria-live="polite" className="text-zinc-400">
          {picked.length ? (
            <>
              <span className="text-zinc-200">Where I&apos;ve used {listOf(picked)}</span>
              <span className="text-zinc-500"> · </span>
              <button type="button" onClick={onClear} className={textLink}>
                Show favorites
              </button>
            </>
          ) : (
            'Pick skills above to see where I’ve put them to work.'
          )}
        </p>
        <Link to="/projects" className={`inline-flex shrink-0 items-center gap-1 ${textLink}`}>
          All projects
          <IconArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {shown.length ? (
        <ul className="mt-4 grid w-full gap-4 md:grid-cols-3">
          {shown.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} compact />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 w-full rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
          Nothing in the gallery with {listOf(picked)} yet.
        </p>
      )}
    </section>
  )
}
