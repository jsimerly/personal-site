import { act, render } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useJourneyProgress } from './useJourneyProgress'

// A page laid out by hand: where the timeline, its entries, and the sorting
// stage sit on the page (top and height, in page pixels). Boxes are reported
// relative to the screen, as the browser would after scrolling.
const SCREEN = 1000 // collect line at 650, reveal line at 920
const PAGE = 10_000
let page
// Animation frames wait in line until the test runs them, as in a browser.
let frames = []
const runFrames = () =>
  act(() => {
    const due = frames
    frames = []
    due.forEach((callback) => callback())
  })

function place(element, box) {
  element.getBoundingClientRect = () => {
    const top = box.top - window.scrollY
    return { top, bottom: top + box.height, height: box.height, width: 100 }
  }
}

function Harness({ onState }) {
  const timelineRef = useRef(null)
  const stageRef = useRef(null)
  onState(useJourneyProgress(timelineRef, stageRef))
  return (
    <>
      <div
        ref={(element) => {
          timelineRef.current = element
          if (element) place(element, page.timeline)
        }}
      >
        {page.entries.map((top) => (
          <div key={top} data-journey-entry ref={(element) => element && place(element, { top, height: 80 })} />
        ))}
      </div>
      <div
        ref={(element) => {
          stageRef.current = element
          if (element) place(element, page.stage)
        }}
      />
    </>
  )
}

function renderAt(scrollY) {
  window.scrollY = scrollY
  let state
  render(<Harness onState={(next) => (state = next)} />)
  runFrames()
  return {
    current: () => state,
    scrollTo: (y) => {
      act(() => {
        window.scrollY = y
        window.dispatchEvent(new Event('scroll'))
      })
      runFrames()
    },
  }
}

describe('useJourneyProgress', () => {
  beforeEach(() => {
    page = { timeline: { top: 300, height: 1000 }, entries: [300, 700], stage: { top: 3000, height: 900 } }
    frames = []
    vi.stubGlobal('requestAnimationFrame', (callback) => frames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', () => {})
    Object.defineProperty(window, 'innerHeight', { value: SCREEN, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: PAGE, configurable: true })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('collects nothing before the reader scrolls, even entries already above the collect line', () => {
    const progress = renderAt(0)

    // Both entries are on screen (above the reveal line), and the first is
    // above the collect line, but the journey starts with the reader.
    expect(progress.current()).toEqual({ progress: 0, revealed: 2, passed: 0, sortProgress: 0 })
  })

  it('collects each entry once scrolling carries it above the collect line', () => {
    const progress = renderAt(0)

    // The timeline's top is now 200px down the screen: the line fills to the
    // collect line, (650 - 200) / 1000 of the way.
    progress.scrollTo(100)
    expect(progress.current()).toMatchObject({ revealed: 2, passed: 2, progress: 0.45 })

    progress.scrollTo(1)
    expect(progress.current()).toMatchObject({ passed: 1 })
  })

  it('sorts the basket only once the end of the timeline is a quarter of the way down, then at the reader’s pace', () => {
    const progress = renderAt(0)

    // The timeline ends at 1300 on the page. Scrolled 1000, its end is still
    // 300px down the screen, below the 25% line.
    progress.scrollTo(1000)
    expect(progress.current().sortProgress).toBe(0)

    // Its end at -50: halfway from 25% down to 60% of a screen higher.
    progress.scrollTo(1350)
    expect(progress.current().sortProgress).toBe(0.5)

    progress.scrollTo(1650)
    expect(progress.current().sortProgress).toBe(1)
  })

  it('counts everything finished at the bottom of the page', () => {
    const progress = renderAt(0)

    progress.scrollTo(PAGE - SCREEN)

    expect(progress.current()).toEqual({ progress: 1, revealed: 2, passed: 2, sortProgress: 1 })
  })

  it('never sorts where the stage is not laid out (phones)', () => {
    page.stage = { top: 3000, height: 0 }
    const progress = renderAt(0)

    progress.scrollTo(2600)
    expect(progress.current().sortProgress).toBe(0)
    progress.scrollTo(PAGE - SCREEN)
    expect(progress.current().sortProgress).toBe(0)
  })
})
