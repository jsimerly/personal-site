import { useEffect, useState } from 'react'

// Where the reader is in the timeline, measured against lines on screen:
// entries fade in once their top crosses REVEAL_AT, and count as passed (their
// skills go in the basket) once they cross COLLECT_AT. `progress` (0 to 1)
// drives how far the spine is filled.
//
// Nothing counts as passed until the page has been scrolled: on a tall screen
// the first cards start out above the collect line, and the journey should
// start with the reader, not on load. (Cards still fade in where they are.)
//
// After the timeline comes the sorting stage. `sortProgress` goes from 0 to 1
// as the end of the timeline ("Today") scrolls from SORT_FROM down the screen
// to SORT_SPAN screens higher, so the basket sorts itself at the reader's own
// pace. It waits until "Today" is a quarter of the way down: by then the last
// cards sit above the skills, and they rise faster than the rows grow, so the
// rows never spread into them.
const REVEAL_AT = 0.92
const COLLECT_AT = 0.65
const SORT_FROM = 0.25
const SORT_SPAN = 0.6

const clamp01 = (value) => Math.min(1, Math.max(0, value))

export function useJourneyProgress(timelineRef, stageRef) {
  const [state, setState] = useState({ progress: 0, revealed: 0, passed: 0, sortProgress: 0 })

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return undefined

    let frame = 0
    const measure = () => {
      frame = 0
      const revealLine = window.innerHeight * REVEAL_AT
      const collectLine = window.innerHeight * COLLECT_AT
      const box = timeline.getBoundingClientRect()
      const entries = timeline.querySelectorAll('[data-journey-entry]')
      // The stage is only laid out on wide screens; a hidden one has no height.
      const stage = stageRef.current?.getBoundingClientRect()
      const hasStage = Boolean(stage?.height)

      let next
      // On a tall screen the end of the timeline may never reach the collect
      // line, so hitting the bottom of the page counts as finishing it.
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        next = { progress: 1, revealed: entries.length, passed: entries.length, sortProgress: hasStage ? 1 : 0 }
      } else {
        const started = window.scrollY > 0
        let revealed = 0
        let passed = 0
        for (const entry of entries) {
          const top = entry.getBoundingClientRect().top
          if (top < revealLine) revealed += 1
          if (started && top < collectLine) passed += 1
        }
        const sortProgress = hasStage
          ? clamp01((window.innerHeight * SORT_FROM - box.bottom) / (window.innerHeight * SORT_SPAN))
          : 0
        next = {
          progress: !started ? 0 : box.height ? clamp01((collectLine - box.top) / box.height) : 1,
          revealed,
          passed,
          // Rounded so tiny scrolls don't re-render the basket for nothing.
          sortProgress: Math.round(sortProgress * 500) / 500,
        }
      }

      setState((previous) =>
        Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next,
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [timelineRef, stageRef])

  return state
}
