import { vi } from 'vitest'

// Stubs global fetch with canned JSON per URL. Unknown URLs answer 404.
export function fakeFetch(routes) {
  const fetch = vi.fn(async (url) => {
    const found = url in routes
    return {
      ok: found,
      status: found ? 200 : 404,
      json: async () => routes[url],
    }
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}
