import { Link } from 'react-router'
import { KIND_LABELS } from '../projects'
import ProjectCover from './ProjectCover.jsx'
import TagList from './TagList.jsx'

// A project's card. `compact` drops the cover and trims the summary to two
// lines, for places that need several projects to fit on one screen.
export default function ProjectCard({ project, compact = false }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
    >
      {!compact && <ProjectCover project={project} className="aspect-video" />}
      <div className={`flex flex-1 flex-col ${compact ? 'p-3.5' : 'p-4'}`}>
        <p className="flex justify-between gap-2 text-xs text-zinc-500">
          <span>{KIND_LABELS[project.kind]}</span>
          <span>{project.year}</span>
        </p>
        <h3 className="mt-1 font-semibold tracking-tight group-hover:text-accent-600 dark:group-hover:text-accent-400">
          {project.name}
        </h3>
        <p className={`mt-1 text-sm text-zinc-600 dark:text-zinc-400 ${compact ? 'line-clamp-2' : ''}`}>
          {project.summary}
        </p>
        <TagList tags={project.tags.slice(0, compact ? 3 : 4)} className={`mt-auto ${compact ? 'pt-3' : 'pt-4'}`} />
      </div>
    </Link>
  )
}
