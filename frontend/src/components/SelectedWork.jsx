import { IconArrowRight, IconChartLine } from '@tabler/icons-react'
import { Link } from 'react-router'
import { selectedWork } from '../content/selectedWork'
import { projects } from '../projects'
import TagList from './TagList.jsx'
import { textLink } from './ui'

// The proof right under the first screen: a few pieces of work, each with
// where it was done and what changed. A card opens its project page; the
// title's link stretches over the card, so the name is what a screen reader
// announces, and a "try it" link sits above that stretch.
export default function SelectedWork() {
  const cards = selectedWork.map((work) => ({ ...work, ...projects.find((project) => project.slug === work.project) }))

  return (
    <section id="work" aria-labelledby="work-title" className="mt-20 scroll-mt-20 sm:mt-24">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h2 id="work-title" className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Selected work
          </h2>
          <p className="mt-2 text-zinc-400">What I&apos;ve led and built, and what changed because of it.</p>
        </div>
        <Link to="/projects" className={`inline-flex items-center gap-1 text-sm ${textLink}`}>
          Everything I&apos;ve built
          <IconArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((work) => (
          <li
            key={work.slug}
            className="relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-zinc-600 hover:bg-zinc-900 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-500 sm:p-6"
          >
            <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">{work.org}</p>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-zinc-50">
              <Link
                to={`/projects/${work.slug}`}
                className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
              >
                {work.name}
              </Link>
            </h3>
            <p className="mt-2 leading-7 text-zinc-300">{work.outcome}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
              <TagList tags={work.tags.slice(0, 3)} />
              {work.live && (
                <Link
                  to={work.live}
                  className={`relative z-10 inline-flex items-center gap-1.5 text-sm ${textLink}`}
                >
                  <IconChartLine size={16} aria-hidden="true" />
                  Explore it live
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
