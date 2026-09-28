import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'
import { projects } from './projects'
import { fakeFetch } from './test/fakeFetch'

const API = {
  '/api/health/': { status: 'ok' },
  '/api/example/items/': [
    { id: 1, name: 'First item' },
    { id: 2, name: 'Second item' },
  ],
}

function renderAt(path, basename) {
  fakeFetch(API)
  return render(
    <MemoryRouter initialEntries={[path]} basename={basename}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('lists every registered project on the home page', () => {
    renderAt('/')

    for (const project of projects) {
      expect(screen.getByRole('link', { name: new RegExp(project.name) })).toHaveAttribute(
        'href',
        `/projects/${project.slug}`,
      )
    }
  })

  it('shows a not-found page for unknown paths', () => {
    renderAt('/nowhere')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('reports the API as online once the health check answers', async () => {
    renderAt('/')

    expect(await screen.findByText('API online')).toBeInTheDocument()
  })

  // Without the custom domain, Pages serves the site under /personal-site/,
  // which main.jsx gets from Vite's BASE_URL. Deep links must still route and fetch.
  it('loads a project page when the site is served under a base path', async () => {
    renderAt('/personal-site/projects/example', '/personal-site/')

    expect(await screen.findByText('First item')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Jacob Simerly' })).toHaveAttribute('href', '/personal-site/')
  })
})
