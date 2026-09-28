import { describe, expect, it, vi } from 'vitest'
import { fakeFetch } from '../test/fakeFetch'

async function loadApi() {
  vi.resetModules()
  return import('./api')
}

describe('apiGet', () => {
  it('calls relative paths when no API base URL is set, for the dev proxy', async () => {
    const fetch = fakeFetch({ '/api/health/': { status: 'ok' } })
    const { apiGet } = await loadApi()

    await expect(apiGet('/api/health/')).resolves.toEqual({ status: 'ok' })
    expect(fetch).toHaveBeenCalledWith('/api/health/', expect.anything())
  })

  it('prefixes the configured API base URL, ignoring a trailing slash', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.run.app/')
    const fetch = fakeFetch({ 'https://api.example.run.app/api/health/': { status: 'ok' } })
    const { apiGet } = await loadApi()

    await apiGet('/api/health/')
    expect(fetch).toHaveBeenCalledWith('https://api.example.run.app/api/health/', expect.anything())
  })

  it('throws an ApiError carrying the status on a failed response', async () => {
    fakeFetch({})
    const { apiGet, ApiError } = await loadApi()

    const error = await apiGet('/api/missing/').catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(404)
  })
})
