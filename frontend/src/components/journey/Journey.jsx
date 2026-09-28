import { useMemo, useRef, useState } from 'react'
import { journey, skillTotals } from '../../content/journey'
import BubbleCluster from './BubbleCluster.jsx'
import { erasOf } from './eras'
import JourneyEntry from './JourneyEntry.jsx'
import JourneyProjects from './JourneyProjects.jsx'
import SkillTray from './SkillTray.jsx'
import WhatsNext from './WhatsNext.jsx'
import { useJourneyProgress } from './useJourneyProgress'
import { FLIGHT_MS, MAX_ENTRIES_AT_ONCE, useSkillFlights } from './useSkillFlights'

// The basket's column between the two sides (20rem), and how wide the rows
// get when it sorts itself by kind at the end.
const CLUSTER_WIDTH = 320
const SORTED_WIDTH = 960

// Consecutive entries grouped under their year, keeping each entry's index
// so reveal and collect state can be matched to it.
function groupByYear(entries) {
  const years = []
  entries.forEach((entry, index) => {
    const year = entry.date.slice(0, 4)
    const current = years.at(-1)
    if (current?.year === year) current.items.push({ entry, index })
    else years.push({ year, items: [{ entry, index }] })
  })
  return years
}

// For each entry, the skills it's the first to use. (A negative number is a
// skill being dropped, not picked up.)
function firstUses(entries) {
  const seen = new Set()
  return entries.map((entry) => {
    const used = Object.entries(entry.skills).filter(([, points]) => points > 0)
    const fresh = new Set(used.map(([skill]) => skill).filter((skill) => !seen.has(skill)))
    fresh.forEach((skill) => seen.add(skill))
    return fresh
  })
}

const YEARS = groupByYear(journey)
const NEW_SKILLS = firstUses(journey)
// Where each new school or job starts: entry index -> place name.
const ERA_STARTS = new Map(erasOf(journey).map(({ start, org }) => [start, org]))

// Chips fly into the basket only when scrolling down past a few entries at a
// time; a fast fling or a scroll back up just updates the basket. Decided
// once per change in `passed` (React's "remember the previous" pattern) so
// the flights and the basket agree.
function useFlying(passed) {
  const [seen, setSeen] = useState({ passed, flying: false })
  if (seen.passed === passed) return seen.flying
  const flying = passed > seen.passed && passed - seen.passed <= MAX_ENTRIES_AT_ONCE
  setSeen({ passed, flying })
  return flying
}

export default function Journey() {
  const timelineRef = useRef(null)
  const stageRef = useRef(null)
  const { progress, revealed, passed, sortProgress } = useJourneyProgress(timelineRef, stageRef)
  // Finished once every entry and the "Today" marker have scrolled past.
  const complete = passed >= journey.length && progress >= 1
  const totals = useMemo(() => skillTotals(journey.slice(0, passed)), [passed])
  const flying = useFlying(passed)
  useSkillFlights(passed, flying, '[data-basket="desktop"]')

  // Skills picked in the sorted basket choose the projects shown after it.
  // Picking only works once the rows have landed; scrolling back up into the
  // sort puts them down again.
  const [picked, setPicked] = useState([])
  if (sortProgress < 1 && picked.length) setPicked([])
  const togglePick = (skill) =>
    setPicked((current) => (current.includes(skill) ? current.filter((each) => each !== skill) : [...current, skill]))

  return (
    <section aria-labelledby="journey-title" className="mt-20">
      <h2 id="journey-title" className="text-2xl font-semibold tracking-tight">
        The journey so far
      </h2>
      <p className="mt-2 max-w-2xl text-zinc-400">
        <span className="text-work">Work and school</span> on the left, <span className="text-build">personal</span>{' '}
        projects on the right. As you scroll, each one&apos;s skills jump into the middle and grow every time I use
        them again, colored by where they came from, with <span className="text-both">purple</span> for both.
      </p>

      {/* The timeline, then room to keep scrolling while the basket sorts
          itself. The basket rides down the middle of both. */}
      <div className="relative mt-10">
        <div ref={timelineRef} className="relative">
          {/* Which side is which: a slim bar pinned under the site header
              while the timeline scrolls, so cards pass beneath it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none sticky top-14 z-20 mb-6 hidden justify-between border-b border-zinc-900 bg-zinc-950/85 py-2 text-[11px] font-semibold tracking-widest uppercase backdrop-blur md:flex"
          >
            <p className="text-work">Work and School</p>
            <p className="text-build">Personal</p>
          </div>

          <div aria-hidden="true" className="absolute inset-y-0 left-3 w-0.5 -translate-x-1/2 bg-zinc-800 md:left-1/2">
            <div
              className="w-full bg-linear-to-b from-work via-both to-build shadow-[0_0_6px_var(--color-both)] transition-[height] duration-150"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          <ol className="space-y-10">
            {YEARS.map(({ year, items }) => (
              <li key={year}>
                <div className="relative z-1 mb-6 flex md:justify-center">
                  <span className="ml-3 -translate-x-1/2 rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-300 tabular-nums md:ml-0 md:translate-x-0">
                    {year}
                  </span>
                </div>
                <ol className="space-y-6">
                  {items.map(({ entry, index }) => (
                    <JourneyEntry
                      key={`${entry.date}-${entry.title}`}
                      entry={entry}
                      index={index}
                      newSkills={NEW_SKILLS[index]}
                      era={ERA_STARTS.get(index)}
                      revealed={index < revealed}
                      passed={index < passed}
                    />
                  ))}
                </ol>
              </li>
            ))}
          </ol>

          {/* The lived part of the line ends here. */}
          <div data-journey-end className="relative mt-12 h-4">
            <span
              aria-hidden="true"
              className={`absolute top-0 left-3 size-4 -translate-x-1/2 rounded-full md:left-1/2 ${
                complete ? 'bg-both shadow-[0_0_8px_var(--color-both)] ring-4 ring-both/25' : 'border-2 border-zinc-600 bg-zinc-950'
              }`}
            />
            <span className="absolute top-1/2 left-8 -translate-y-1/2 text-sm font-medium text-zinc-300 md:left-[calc(50%+1.25rem)] lg:left-[calc(50%+10.75rem)]">
              Today
            </span>
          </div>
        </div>

        {/* Past today the line keeps going, dashed, to what's next. The basket
            sorts itself along this stretch, then catches against the projects. */}
        <div ref={stageRef} aria-hidden="true" className="relative hidden h-[90vh] lg:block">
          <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-zinc-700" />
        </div>

        <div className="absolute inset-y-0 left-1/2 z-10 hidden w-80 -translate-x-1/2 lg:block">
          <BubbleCluster
            totals={totals}
            sortProgress={sortProgress}
            popDelay={flying ? FLIGHT_MS : 0}
            width={CLUSTER_WIDTH}
            sortedWidth={SORTED_WIDTH}
            picked={picked}
            onToggle={togglePick}
          />
        </div>
      </div>

      <JourneyProjects picked={picked} onClear={() => setPicked([])} />
      <SkillTray className="lg:hidden" totals={totals} complete={complete} />
      <WhatsNext />
    </section>
  )
}
