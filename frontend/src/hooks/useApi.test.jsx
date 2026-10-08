import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { fakeFetch } from '../test/fakeFetch'
import { SLOW_AFTER_MS, useApi } from './useApi'

describe('useApi', () => {
  it('returns the data once it loads', async () => {
    fakeFetch({ '/api/things/': [1, 2, 3] })
    const { result } = renderHook(() => useApi('/api/things/'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual([1, 2, 3])
    expect(result.current.error).toBeNull()
  })

  it('surfaces a failed request as an error', async () => {
    fakeFetch({})
    const { result } = renderHook(() => useApi('/api/missing/'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error.status).toBe(404)
  })

  it('flags a slow request so the UI can explain a cold start', () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
    const { result } = renderHook(() => useApi('/api/things/'))

    act(() => vi.advanceTimersByTime(SLOW_AFTER_MS - 1))
    expect(result.current.slow).toBe(false)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.slow).toBe(true)
  })

  it('ignores a late response for a path it has moved away from', async () => {
    const pending = {}
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => new Promise((resolve) => (pending[url] = (body) => resolve({ ok: true, json: async () => body })))),
    )
    const { result, rerender } = renderHook(({ path }) => useApi(path), { initialProps: { path: '/api/old/' } })

    rerender({ path: '/api/new/' })
    await act(async () => pending['/api/new/']('new'))
    await act(async () => pending['/api/old/']('old'))

    expect(result.current.data).toBe('new')
  })

  it('shows nothing while a new path loads, unless asked to keep the previous data', async () => {
    const pending = {}
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => new Promise((resolve) => (pending[url] = (body) => resolve({ ok: true, json: async () => body })))),
    )
    const { result, rerender } = renderHook(({ path, keep }) => useApi(path, { keepPrevious: keep }), {
      initialProps: { path: '/api/old/', keep: false },
    })
    await act(async () => pending['/api/old/']('old'))

    rerender({ path: '/api/new/', keep: false })
    expect(result.current).toMatchObject({ data: null, loading: true, stale: false })

    rerender({ path: '/api/new/', keep: true })
    expect(result.current).toMatchObject({ data: 'old', loading: true, stale: true })

    await act(async () => pending['/api/new/']('new'))
    expect(result.current).toMatchObject({ data: 'new', loading: false, stale: false })
  })

  it('drops the kept data when the new path fails, so the error shows', async () => {
    const pending = {}
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => new Promise((resolve) => (pending[url] = (response) => resolve(response)))),
    )
    const { result, rerender } = renderHook(({ path }) => useApi(path, { keepPrevious: true }), {
      initialProps: { path: '/api/old/' },
    })
    await act(async () => pending['/api/old/']({ ok: true, json: async () => 'old' }))

    rerender({ path: '/api/broken/' })
    await act(async () => pending['/api/broken/']({ ok: false, status: 500 }))

    expect(result.current.data).toBeNull()
    expect(result.current.error.status).toBe(500)
  })
})
