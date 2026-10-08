import { IconBrandGithub, IconChartLine, IconExternalLink } from '@tabler/icons-react'
import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import ProjectCover from '../components/ProjectCover.jsx'
import TagList from '../components/TagList.jsx'
import { buttonStyles, newTab, textLink } from '../components/ui'
import { portfolio } from '../content/portfolio'
import { projects } from '../projects'

const tabId = (slug) => `portfolio-tab-${slug}`
const panelId = (slug) => `portfolio-panel-${slug}`

// A piece that's ready: its project's story and links, beside its cover (or
// its live preview, when it has one).
function Showcase({ piece }) {
  const project = projects.find((each) => each.slug === piece.project)
  const { links } = project
  const { Preview } = piece
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div>
        <p className="text-sm text-zinc-500">{project.year}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{project.name}</h2>
        <p className="mt-3 text-lg leading-8 text-zinc-400">{project.summary}</p>
        {project.description && (
          <div className="mt-4 space-y-3 leading-7 text-zinc-300">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
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
        <TagList tags={project.tags} className="mt-6" />
      </div>
      {Preview ? <Preview /> : <ProjectCover project={project} className="aspect-video rounded-xl" />}
    </div>
  )
}

// A piece that isn't ready yet: its name, a line about it, and an empty frame
// where the showcase will go.
function ComingSoon({ piece }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div>
        <p className="text-sm text-zinc-500">Coming soon</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{piece.name}</h2>
        <p className="mt-3 text-lg leading-8 text-zinc-400">{piece.summary}</p>
      </div>
      <div
        aria-hidden="true"
        className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-zinc-700 text-sm text-zinc-500"
      >
        In the works
      </div>
    </div>
  )
}

// The work I can show off, one tab per piece (content/portfolio.js). The open
// tab lives in the URL (?tab=<slug>), so a link can open straight to one; the
// first tab is the default and needs no parameter.
export default function Portfolio() {
  const [params, setParams] = useSearchParams()
  const active = portfolio.find((piece) => piece.slug === params.get('tab')) ?? portfolio[0]
  const tabs = useRef([])

  const select = (piece) => setParams(piece === portfolio[0] ? {} : { tab: piece.slug }, { replace: true })
  // Arrow keys, Home, and End move between tabs (the ARIA tabs pattern), and
  // focus follows so the next key press keeps going from there.
  const onKeyDown = (event) => {
    const index = portfolio.indexOf(active)
    const to = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: portfolio.length - 1 }[event.key]
    if (to === undefined) return
    event.preventDefault()
    const next = (to + portfolio.length) % portfolio.length
    select(portfolio[next])
    tabs.current[next]?.focus()
  }

  return (
    <>
      <title>Portfolio | Jacob Simerly</title>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Portfolio</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        A few things I&apos;ve built that you can see and use for yourself, with more on the way. Everything else
        lives in{' '}
        <Link to="/projects" className={textLink}>
          Projects
        </Link>
        .
      </p>

      <div
        role="tablist"
        aria-label="Portfolio"
        onKeyDown={onKeyDown}
        className="mt-10 flex gap-6 overflow-x-auto border-b border-zinc-800"
      >
        {portfolio.map((piece, index) => (
          <button
            key={piece.slug}
            ref={(element) => {
              tabs.current[index] = element
            }}
            type="button"
            role="tab"
            id={tabId(piece.slug)}
            aria-controls={panelId(piece.slug)}
            aria-selected={piece === active}
            tabIndex={piece === active ? 0 : -1}
            onClick={() => select(piece)}
            className="-mb-px flex shrink-0 cursor-pointer items-center gap-2 border-b-2 border-transparent pb-3 text-sm font-medium whitespace-nowrap text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 aria-selected:border-zinc-100 aria-selected:text-zinc-50"
          >
            {piece.name}
            {piece.soon && (
              <>
                {/* The space keeps the screen reader name "Name (coming soon)". */}
                {' '}
                <span aria-hidden="true" className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
                  Soon
                </span>
                <span className="sr-only">(coming soon)</span>
              </>
            )}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={panelId(active.slug)}
        aria-labelledby={tabId(active.slug)}
        tabIndex={0}
        className="mt-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent-500"
      >
        {active.soon ? <ComingSoon piece={active} /> : <Showcase piece={active} />}
      </div>
    </>
  )
}
