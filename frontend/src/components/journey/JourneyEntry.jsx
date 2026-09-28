import { Link } from 'react-router'
import { formatMonth } from '../../lib/format'

// Class names are spelled out in full so Tailwind can find them. On a phone
// every card sits right of the spine; from md up, work is left and builds are
// right, and from lg up a center column is kept free for the basket.
const SIDES = {
  work: {
    label: 'Work',
    chip: 'bg-work/15 text-work',
    newSkill: 'bg-work/15 text-work',
    dot: 'bg-work shadow-[0_0_6px_var(--color-work)]',
    column: 'md:col-start-1',
  },
  build: {
    label: 'Build',
    chip: 'bg-build/15 text-build',
    newSkill: 'bg-build/15 text-build',
    dot: 'bg-build shadow-[0_0_6px_var(--color-build)]',
    column: 'md:col-start-2 lg:col-start-3',
  },
}

const ROW = 'md:grid md:grid-cols-2 md:gap-x-16 lg:grid-cols-[minmax(0,1fr)_20rem_minmax(0,1fr)] lg:gap-x-8'

function EntryTitle({ entry }) {
  const linkClass = 'hover:underline decoration-zinc-500 underline-offset-4'
  if (entry.project) {
    return (
      <Link to={`/projects/${entry.project}`} className={linkClass}>
        {entry.title}
      </Link>
    )
  }
  if (entry.href) {
    return (
      <a href={entry.href} className={linkClass}>
        {entry.title}
      </a>
    )
  }
  return entry.title
}

// `newSkills` are the ones this entry is the first to use, tinted in the
// entry's side color. Every chip carries data-skill-chip so it can fly into
// the basket. Skills with a negative number are being dropped here, so they
// shrink in the basket without a chip.
export default function JourneyEntry({ entry, index, newSkills, revealed, passed }) {
  const side = SIDES[entry.side]
  const skills = Object.keys(entry.skills).filter((skill) => entry.skills[skill] > 0)

  return (
    <li data-journey-entry data-entry-index={index} className={`relative ${ROW}`}>
      <span
        aria-hidden="true"
        className={`absolute top-5 left-3 z-1 size-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-500 md:left-1/2 ${
          passed ? `${side.dot} border-transparent` : 'border-zinc-600 bg-zinc-950'
        }`}
      />
      <article
        className={`ml-9 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition duration-700 ease-out motion-reduce:transition-none md:ml-0 ${side.column} ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
        }`}
      >
        <p className="flex items-center justify-between gap-3 text-xs">
          <span className={`rounded-md px-1.5 py-0.5 font-medium ${side.chip}`}>{side.label}</span>
          <time dateTime={entry.date} className="text-zinc-500 tabular-nums">
            {formatMonth(entry.date)}
            {entry.end && ` – ${entry.end === 'now' ? 'now' : formatMonth(entry.end)}`}
          </time>
        </p>
        <h3 className="mt-2 font-semibold tracking-tight text-zinc-100">
          <EntryTitle entry={entry} />
        </h3>
        {entry.summary && <p className="mt-1 text-sm text-zinc-400">{entry.summary}</p>}
        {skills.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills">
            {skills.map((skill) =>
              newSkills.has(skill) ? (
                <li
                  key={skill}
                  data-skill-chip={skill}
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${side.newSkill}`}
                >
                  <span className="sr-only">New skill: </span>+ {skill}
                </li>
              ) : (
                <li
                  key={skill}
                  data-skill-chip={skill}
                  className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                >
                  {skill}
                </li>
              ),
            )}
          </ul>
        )}
      </article>
    </li>
  )
}
