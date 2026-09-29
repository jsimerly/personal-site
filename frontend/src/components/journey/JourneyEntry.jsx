import { Link } from 'react-router'
import { formatMonth } from '../../lib/format'
import { SIDES } from './sides'

const ROW = 'md:grid md:grid-cols-2 md:gap-x-16 lg:grid-cols-[minmax(0,1fr)_20rem_minmax(0,1fr)] lg:gap-x-8'

// '2021-01' and '2022-12' -> 'Jan 2021 – Dec 2022'; an open end is 'now'.
function span(start, end) {
  return `${formatMonth(start)}${end ? ` – ${end === 'now' ? 'now' : formatMonth(end)}` : ''}`
}

// A card with a project page is a link as a whole: the title's link stretches
// over the card, so the name is what a screen reader announces.
function EntryTitle({ entry }) {
  if (!entry.project) return entry.title
  return (
    <Link
      to={`/projects/${entry.project}`}
      className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
    >
      {entry.title}
    </Link>
  )
}

// A card on the timeline. Which side it's on already says work or personal,
// so the card has no label for it: just the title and dates, then skills.
// `newSkills` are the ones this entry is the first to use, tinted in the
// entry's side color (no plus sign: every chip is something gained). `era` is the school or company name when this entry is
// the first at a new place; it sits quietly above the card to mark the
// change. Every chip carries data-skill-chip so it can fly into the basket.
// Skills with a negative number are being dropped here, so they shrink in the
// basket without a chip.
// `position` is set on the first card from a job: its logo, title, and dates
// go above the card, and the cards under it are projects from that job.
// `top` places the card on the timeline (timelineLayout); the row spans the
// full width, so it lets clicks through to a card beside it.
export default function JourneyEntry({ entry, index, newSkills, era, position, top = 0, revealed, passed }) {
  const side = SIDES[entry.side]
  const skills = Object.keys(entry.skills).filter((skill) => entry.skills[skill] > 0)
  const logos = position?.logos ?? entry.logos

  return (
    <li
      data-journey-entry
      data-entry-index={index}
      data-layout-key={`entry-${index}`}
      data-layout-kind="entry"
      data-lane={entry.side}
      className={`pointer-events-none absolute inset-x-0 ${ROW}`}
      style={{ top }}
    >
      {/* The dot sits level with the title's first line, below whatever is
          above the card. */}
      <span
        aria-hidden="true"
        className={`absolute left-3 z-1 size-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-500 md:left-1/2 ${
          logos ? 'top-[71px]' : era ? 'top-[45.5px]' : 'top-[23px]'
        } ${
          passed ? `${side.dot} border-transparent` : 'border-zinc-600 bg-zinc-950'
        }`}
      />
      <div
        className={`pointer-events-auto ml-9 transition duration-700 ease-out motion-reduce:transition-none md:ml-0 ${side.column} ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
        }`}
      >
        {/* Above the card, quietly: the place's logos, greyed to one
            silhouette color (decorative, so screen readers skip them), and
            beside them the position held there; or else the name of a new
            school or company. Always the same height, so the dot lines up. */}
        {logos ? (
          <div className="mb-2 flex h-10 items-end gap-3">
            {logos.map((logo) => (
              <img
                key={logo}
                src={`${import.meta.env.BASE_URL}${logo}`}
                alt=""
                className="h-8 w-auto opacity-35 brightness-0 invert"
              />
            ))}
            {position && (
              <div className="min-w-0 leading-tight">
                <p title={position.title} className="truncate text-[13px] font-medium text-zinc-300">
                  {position.title}
                </p>
                <p className="text-xs text-zinc-500 tabular-nums">{span(position.start, position.end)}</p>
              </div>
            )}
          </div>
        ) : (
          era && <p className="mb-1.5 text-[11px] font-medium tracking-widest text-zinc-600 uppercase">{era}</p>
        )}
        <article
          className={`relative rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 ${
            entry.project
              ? 'transition-colors hover:border-zinc-600 hover:bg-zinc-900 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-500'
              : ''
          }`}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-semibold tracking-tight text-zinc-100">
              <EntryTitle entry={entry} />
            </h3>
            {/* A project from a job goes by the job's dates, shown above. */}
            {!entry.position && (
              <time dateTime={entry.date} className="shrink-0 text-xs text-zinc-500 tabular-nums">
                {span(entry.date, entry.end)}
              </time>
            )}
          </div>
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
                    <span className="sr-only">New skill: </span>
                    {skill}
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
