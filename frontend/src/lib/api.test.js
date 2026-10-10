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

describe('apiPost', () => {
  it('sends JSON to the API and returns what it answers', async () => {
    const fetch = fakeFetch({ '/api/contact/': () => ({ status: 202, body: { ok: true } }) })
    const { apiPost } = await loadApi()

    await expect(apiPost('/api/contact/', { contact: 'jane@example.com' })).resolves.toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledWith('/api/contact/', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: '{"contact":"jane@example.com"}',
    })
  })

  it("throws an ApiError carrying the status and the API's reason when it refuses", async () => {
    fakeFetch({ '/api/contact/': () => ({ status: 400, body: { contact: ['Enter an email address or a phone number.'] } }) })
    const { apiPost, ApiError } = await loadApi()

    const error = await apiPost('/api/contact/', { contact: 'nope' }).catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(400)
    expect(error.body).toEqual({ contact: ['Enter an email address or a phone number.'] })
  })

  it('still throws, with no reason, when a failed response has no JSON', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 502, json: async () => JSON.parse('<html>') })))
    const { apiPost } = await loadApi()

    const error = await apiPost('/api/contact/', {}).catch((e) => e)
    expect([error.status, error.body]).toEqual([502, null])
  })
})
