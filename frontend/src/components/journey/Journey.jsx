import { useMemo, useRef, useState } from 'react'
import { journey, skillTotals } from '../../content/journey'
import BubbleCluster from './BubbleCluster.jsx'
import { erasOf } from './eras'
import JourneyEntry from './JourneyEntry.jsx'
import JourneyProjects from './JourneyProjects.jsx'
import SkillTray from './SkillTray.jsx'
import { useTimelineLayout } from './timelineLayout'
import WhatsNext from './WhatsNext.jsx'
import { useJourneyProgress } from './useJourneyProgress'
import { FLIGHT_MS, MAX_ENTRIES_AT_ONCE, useSkillFlights } from './useSkillFlights'

// The basket's column between the two sides (20rem), and how wide the rows
// get when it sorts itself by kind at the end: the same width as the project
// cards below (max-w-5xl), so the two line up.
const CLUSTER_WIDTH = 320
const SORTED_WIDTH = 1024

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
// The first card from each position (entry index -> position), which shows
// the position above it. Two roles at one company are two positions.
const POSITION_STARTS = new Map(
  journey
    .map((entry, index) => [index, entry.position])
    .filter(([index, position]) => position && journey.slice(0, index).every((earlier) => earlier.position !== position)),
)

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
  // Cards are placed by measurement, two lanes side by side (timelineLayout).
  const listRef = useRef(null)
  const layout = useTimelineLayout(listRef)
  const topOf = (key) => layout.tops.get(key) ?? 0
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
      <h2 id="journey-title" className="text-center text-2xl font-semibold tracking-tight">
        My journey
      </h2>

      {/* The timeline, then room to keep scrolling while the basket sorts
          itself. The basket rides down the middle of both. */}
      <div className="relative mt-10">
        <div ref={timelineRef} className="relative">
          {/* Which side is which, at the top of the timeline. It scrolls away
              with the page rather than pinning: a pinned bar has to cut off
              the cards and the skills passing under it. */}
          <div
            aria-hidden="true"
            className="mb-12 hidden justify-between text-[11px] font-semibold tracking-widest uppercase md:flex"
          >
            <p className="text-work">Work and School</p>
            <p className="text-build">Personal</p>
          </div>

          <div aria-hidden="true" className="absolute inset-y-0 left-3 w-0.5 -translate-x-1/2 bg-zinc-800 md:left-1/2">
            <div
              className="w-full bg-zinc-400 transition-[height] duration-150"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          <ol ref={listRef} className="relative" style={{ height: layout.height }}>
            {YEARS.map(({ year, items }) => (
              <li key={year}>
                <div
                  data-layout-key={`year-${year}`}
                  data-layout-kind="year"
                  className="pointer-events-none absolute inset-x-0 z-1 flex md:justify-center"
                  style={{ top: topOf(`year-${year}`) }}
                >
                  <span className="ml-3 -translate-x-1/2 rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-300 tabular-nums md:ml-0 md:translate-x-0">
                    {year}
                  </span>
                </div>
                <ol>
                  {items.map(({ entry, index }) => (
                    <JourneyEntry
                      key={`${entry.date}-${entry.title}`}
                      entry={entry}
                      index={index}
                      newSkills={NEW_SKILLS[index]}
                      era={ERA_STARTS.get(index)}
                      position={POSITION_STARTS.get(index)}
                      top={topOf(`entry-${index}`)}
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
                complete ? 'bg-both ring-4 ring-both/20' : 'border-2 border-zinc-600 bg-zinc-950'
              }`}
            />
            <span className="absolute top-1/2 left-8 -translate-y-1/2 text-sm font-medium text-zinc-300 md:left-[calc(50%+1.25rem)] lg:left-[calc(50%+10.75rem)]">
              Today
            </span>
          </div>
        </div>

        {/* Past today the line keeps going, dashed, to what's next. The basket
            sorts itself along this stretch once "Today" is up out of the way,
            then catches against the projects. Long enough for the rows to land
            just before the catch. */}
        <div ref={stageRef} aria-hidden="true" className="relative hidden h-[110vh] lg:block">
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
