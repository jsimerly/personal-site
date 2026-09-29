import { useLayoutEffect, useRef } from 'react'

// When entries scroll past on the way down, a copy of each of their skill
// chips arcs from the card into that skill's bubble in the basket. The
// caller decides when chips fly (`flying`): only on the way down, and only a
// few entries at a time, so a fast scroll doesn't fill the screen with them.
export const FLIGHT_MS = 550
const STAGGER_MS = 60
export const MAX_ENTRIES_AT_ONCE = 3

function fly(chip, target, delay) {
  const from = chip.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  if (!to.width || !from.width) return

  const ghost = chip.cloneNode(true)
  Object.assign(ghost.style, {
    // The chip is a list item; outside its list it would grow a bullet.
    display: 'block',
    listStyle: 'none',
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    margin: '0',
    zIndex: '50',
    pointerEvents: 'none',
  })
  ghost.setAttribute('aria-hidden', 'true')
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const flight = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 70}px) scale(1.2)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.8)`, opacity: 0.3 },
    ],
    { duration: FLIGHT_MS - delay, delay, easing: 'cubic-bezier(0.45, 0, 0.25, 1)', fill: 'backwards' },
  )
  flight.onfinish = () => ghost.remove()
  flight.oncancel = () => ghost.remove()
}

export function useSkillFlights(passed, flying, basketSelector) {
  const previous = useRef(passed)

  useLayoutEffect(() => {
    const before = previous.current
    previous.current = passed
    if (!flying || passed <= before) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const basket = document.querySelector(basketSelector)
    if (!basket?.getBoundingClientRect().width) return

    for (let index = before; index < passed; index++) {
      const chips = document.querySelectorAll(`[data-entry-index="${index}"] [data-skill-chip]`)
      chips.forEach((chip, order) => {
        const target = basket.querySelector(`[data-basket-skill="${CSS.escape(chip.dataset.skillChip)}"]`)
        if (target) fly(chip, target, Math.min(order * STAGGER_MS, FLIGHT_MS / 2))
      })
    }
  }, [passed, flying, basketSelector])
}
