import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom has no scrolling; Layout scrolls to the top on every navigation.
window.scrollTo = () => {}
// jsdom can't draw text, so the skill cloud falls back to estimating widths.
HTMLCanvasElement.prototype.getContext = () => null

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.useRealTimers()
})
