import { describe, expect, it } from 'vitest'
import { reachable } from './contact'

describe('reachable', () => {
  it.each(['jane@example.com', '  jane.doe+site@mail.example.co  ', '(317) 555-0142', '317.555.0142', '+1 317 555 0142', '+44 20 7946 0958'])(
    'accepts %j as a way to reach someone',
    (text) => {
      expect(reachable(text)).toBe(true)
    },
  )

  it.each(['', 'jane', 'jane@', '@example.com', 'jane@example', '555-0142', '1234567890123456', 'call me at 3175550142'])(
    'refuses %j, the same as the API would',
    (text) => {
      expect(reachable(text)).toBe(false)
    },
  )
})
