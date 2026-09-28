import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SLOW_AFTER_MS } from '../hooks/useApi'
import { fakeFetch } from '../test/fakeFetch'
import ApiStatus from './ApiStatus.jsx'

describe('ApiStatus', () => {
  it('reports the API online once the health check answers', async () => {
    fakeFetch({ '/api/health/': { status: 'ok' } })
    render(<ApiStatus />)

    expect(await screen.findByText('API online')).toBeInTheDocument()
  })

  it('reports the API offline when the health check fails', async () => {
    fakeFetch({})
    render(<ApiStatus />)

    expect(await screen.findByText('API offline')).toBeInTheDocument()
  })

  it('says it is checking, then that the API is waking up once the check runs slow', () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
    render(<ApiStatus />)

    expect(screen.getByText('Checking the API')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(SLOW_AFTER_MS))
    expect(screen.getByText('Waking up the API')).toBeInTheDocument()
  })
})
