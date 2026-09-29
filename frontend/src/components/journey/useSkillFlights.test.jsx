import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FLIGHT_MS, useSkillFlights } from './useSkillFlights'

// A card's chip at (100, 200), 60 wide and 20 tall, and its bubble in the
// basket at (500, 100), 80 wide and 30 tall: center to center, the chip has
// 410 to go right and 95 to go up.
const box = (left, top, width, height) => () => ({ left, top, width, height })

function Page({ passed, flying }) {
  useSkillFlights(passed, flying, '[data-basket]')
  return (
    <>
      <ul data-entry-index="0">
        <li data-skill-chip="Python" ref={(element) => element && (element.getBoundingClientRect = box(100, 200, 60, 20))}>
          Python
        </li>
      </ul>
      <div data-basket ref={(element) => element && (element.getBoundingClientRect = box(400, 50, 320, 300))}>
        <span
          data-basket-skill="Python"
          ref={(element) => element && (element.getBoundingClientRect = box(500, 100, 80, 30))}
        />
      </div>
    </>
  )
}

describe('useSkillFlights', () => {
  let animate
  let reducedMotion

  beforeEach(() => {
    reducedMotion = false
    animate = vi.fn(() => ({}))
    Element.prototype.animate = animate
    vi.stubGlobal('matchMedia', () => ({ matches: reducedMotion }))
  })

  afterEach(() => {
    delete Element.prototype.animate
    vi.unstubAllGlobals()
  })

  it("flies a copy of each passed entry's chips into their bubbles, then clears it away", () => {
    const { rerender } = render(<Page passed={0} flying={false} />)

    rerender(<Page passed={1} flying />)

    expect(animate).toHaveBeenCalledTimes(1)
    const [keyframes, timing] = animate.mock.calls[0]
    expect(keyframes.at(-1)).toEqual({ transform: 'translate(410px, -95px) scale(0.8)', opacity: 0.3 })
    expect(timing).toMatchObject({ duration: FLIGHT_MS, delay: 0 })

    const ghost = animate.mock.contexts[0]
    expect(ghost.parentElement).toBe(document.body)
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    expect(ghost).toHaveStyle({ position: 'fixed', left: '100px', top: '200px', listStyle: 'none' })

    animate.mock.results[0].value.onfinish()
    expect(ghost.isConnected).toBe(false)
  })

  it('sends nothing flying on the way back up, or when the caller says not to', () => {
    const { rerender } = render(<Page passed={1} flying={false} />)

    rerender(<Page passed={0} flying />)
    rerender(<Page passed={1} flying={false} />)

    expect(animate).not.toHaveBeenCalled()
  })

  it('keeps still for readers who ask for reduced motion', () => {
    reducedMotion = true
    const { rerender } = render(<Page passed={0} flying={false} />)

    rerender(<Page passed={1} flying />)

    expect(animate).not.toHaveBeenCalled()
  })
})
