// Where the DRF backend lives. Unset in dev, so calls go to relative /api/...
// paths that Vite proxies to localhost:8000. Production builds point it at
// the Cloud Run service.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiGet(path, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} failed with ${response.status}`)
  }
  return response.json()
}

// Sends JSON. A refused submission throws an ApiError with the status and,
// in `body`, whatever the API said about why.
export async function apiPost(path, data) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new ApiError(response.status, `POST ${path} failed with ${response.status}`)
    error.body = body
    throw error
  }
  return body
}
