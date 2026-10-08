import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDebounced } from './useDebounced'

describe('useDebounced', () => {
  it('starts on the first value and only moves once a new value holds still', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounced(value, 250), { initialProps: { value: 'a' } })
    expect(result.current).toBe('a')

    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'c' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(50))
    expect(result.current).toBe('c')
  })
})
