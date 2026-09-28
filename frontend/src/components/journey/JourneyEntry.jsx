import { Link } from 'react-router'
import { formatMonth } from '../../lib/format'
import { SIDES, sideLabel } from './sides'

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
// entry's side color. `era` is the school or company name when this entry is
// the first at a new place; it sits quietly above the card to mark the change. Every chip carries data-skill-chip so it can fly into
// the basket. Skills with a negative number are being dropped here, so they
// shrink in the basket without a chip.
export default function JourneyEntry({ entry, index, newSkills, era, revealed, passed }) {
  const side = SIDES[entry.side]
  const skills = Object.keys(entry.skills).filter((skill) => entry.skills[skill] > 0)

  return (
    <li data-journey-entry data-entry-index={index} className={`relative ${ROW}`}>
      <span
        aria-hidden="true"
        className={`absolute left-3 z-1 size-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-500 md:left-1/2 ${era ? 'top-10' : 'top-5'} ${
          passed ? `${side.dot} border-transparent` : 'border-zinc-600 bg-zinc-950'
        }`}
      />
      <div
        className={`ml-9 transition duration-700 ease-out motion-reduce:transition-none md:ml-0 ${side.column} ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
        }`}
      >
        {era && <p className="mb-1.5 text-[11px] font-medium tracking-widest text-zinc-600 uppercase">{era}</p>}
        <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="flex items-center justify-between gap-3 text-xs">
            <span className={`rounded-md px-1.5 py-0.5 font-medium ${side.chip}`}>{sideLabel(entry)}</span>
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
      </div>
    </li>
  )
}
