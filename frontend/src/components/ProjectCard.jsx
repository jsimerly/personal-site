import { Link } from 'react-router'
import { KIND_LABELS } from '../projects'
import ProjectCover from './ProjectCover.jsx'
import TagList from './TagList.jsx'

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
    >
      <ProjectCover project={project} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col p-4">
        <p className="flex justify-between gap-2 text-xs text-zinc-500">
          <span>{KIND_LABELS[project.kind]}</span>
          <span>{project.year}</span>
        </p>
        <h3 className="mt-1 font-semibold tracking-tight group-hover:text-accent-600 dark:group-hover:text-accent-400">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{project.summary}</p>
        <TagList tags={project.tags.slice(0, 4)} className="mt-auto pt-4" />
      </div>
    </Link>
  )
}
