import { IconArrowLeft, IconBrandGithub, IconChartLine, IconExternalLink } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import ProjectCover from '../components/ProjectCover.jsx'
import TagList from '../components/TagList.jsx'
import { buttonStyles, newTab } from '../components/ui'
import { KIND_LABELS, projects } from '../projects'
import NotFound from './NotFound.jsx'

function ProjectDetail({ project }) {
  const { links } = project
  return (
    <article className="mx-auto max-w-3xl">
      <title>{`${project.name} | Jacob Simerly`}</title>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <IconArrowLeft size={16} aria-hidden="true" />
        All projects
      </Link>

      <ProjectCover project={project} className="mt-6 aspect-[2/1] rounded-xl" />

      <p className="mt-8 text-sm text-zinc-500">
        {KIND_LABELS[project.kind]} · {project.year}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
      <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">{project.summary}</p>

      {(links.explore || links.live || links.github) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {links.explore && (
            <Link to={links.explore} className={buttonStyles.primary}>
              <IconChartLine size={16} aria-hidden="true" />
              Explore the data
            </Link>
          )}
          {links.live && (
            <a href={links.live} {...newTab} className={buttonStyles.primary}>
              <IconExternalLink size={16} aria-hidden="true" />
              Visit the site
            </a>
          )}
          {links.github && (
            <a href={links.github} {...newTab} className={buttonStyles.secondary}>
              <IconBrandGithub size={16} aria-hidden="true" />
              View the code
            </a>
          )}
        </div>
      )}

      <TagList tags={project.tags} className="mt-8" />

      {project.description && (
        <div className="mt-8 space-y-4 leading-7 text-zinc-700 dark:text-zinc-300">
          {project.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
    </article>
  )
}

// A project renders its own Page when it has one (interactive or data-backed
// projects); everything else gets the standard write-up.
export default function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project) return <NotFound />

  const { Page } = project
  return Page ? <Page project={project} /> : <ProjectDetail project={project} />
}
