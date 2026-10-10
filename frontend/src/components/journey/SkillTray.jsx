import { IconBasket, IconChevronUp } from '@tabler/icons-react'
import { useState } from 'react'
import { lastingSkills } from '../../content/skillCategories'
import { FADED_COLORS, SORTED_MIN_FONT_PX, bubbleStyle } from './bubble'

const LASTING = new Set(lastingSkills)

// The small-screen basket: a tray along the bottom of the screen while the
// timeline scrolls, newest skill first. Once the journey is complete it stops
// floating and settles under "Today", opened up to show everything: the
// skills that stick around first (biggest first), every other one faded back.
// (Mobile is parked while the desktop version is being worked out.)
export default function SkillTray({ totals, complete, className = '' }) {
  const [expanded, setExpanded] = useState(false)
  const open = complete || expanded
  const shown = complete
    ? [...totals].sort((a, b) => LASTING.has(b.skill) - LASTING.has(a.skill) || b.points - a.points)
    : open
      ? totals
      : [...totals].reverse()
  const faded = (skillTotal) => complete && !LASTING.has(skillTotal.skill)

  return (
    <div
      className={`pointer-events-none z-20 mt-12 flex justify-center ${complete ? 'relative' : 'sticky bottom-3'} ${className}`}
    >
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2 font-medium text-zinc-100">
            <IconBasket size={18} className="shrink-0 text-build" aria-hidden="true" />
            <span className="truncate">Skills</span>
          </span>
          {!complete && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={expanded ? 'Show fewer skills' : 'Show all skills'}
              onClick={() => setExpanded((value) => !value)}
              className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            >
              <IconChevronUp size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className={`mt-3 ${open ? 'max-h-[45vh] overflow-y-auto' : 'max-h-16 overflow-hidden mask-b-from-50%'}`}>
          {totals.length === 0 ? (
            <p className="text-sm text-zinc-500">Scroll the timeline to start collecting.</p>
          ) : (
            <ul className="flex flex-wrap items-center gap-1.5">
              {shown.map((skillTotal) => (
                <li
                  key={skillTotal.skill}
                  style={faded(skillTotal) ? { ...FADED_COLORS, fontSize: `${SORTED_MIN_FONT_PX}px` } : bubbleStyle(skillTotal)}
                  className="animate-pop rounded-full px-[0.75em] py-[0.25em] font-medium text-zinc-100 transition-all duration-500 motion-reduce:animate-none motion-reduce:transition-none"
                >
                  {skillTotal.skill}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
