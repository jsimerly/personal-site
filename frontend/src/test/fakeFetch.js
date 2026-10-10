import { vi } from 'vitest'

// Stubs global fetch with canned JSON per URL. Unknown URLs answer 404.
// A route can also be a function of the request's init (method, body, ...)
// returning { status, body }, for answers that aren't a plain 200.
export function fakeFetch(routes) {
  const fetch = vi.fn(async (url, init = {}) => {
    if (!(url in routes)) return { ok: false, status: 404, json: async () => undefined }
    const route = routes[url]
    const { status, body } = typeof route === 'function' ? await route(init) : { status: 200, body: route }
    return { ok: status >= 200 && status < 300, status, json: async () => body }
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}
