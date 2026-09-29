import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'
import { portfolio } from './content/portfolio'
import { profile } from './content/profile'
import { listedProjects } from './projects'
import { fakeFetch } from './test/fakeFetch'

const API = {
  '/api/health/': { status: 'ok' },
  '/api/example/items/': [
    { id: 1, name: 'First item' },
    { id: 2, name: 'Second item' },
  ],
}

function renderAt(path, basename) {
  const fetch = fakeFetch(API)
  return {
    fetch,
    ...render(
    <MemoryRouter initialEntries={[path]} basename={basename}>
      <App />
    </MemoryRouter>,
    ),
  }
}

describe('App', () => {
  it('introduces me on the home page and points to my portfolio and every project', () => {
    renderAt('/')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Jacob Simerly')
    expect(screen.getByText(profile.title)).toHaveTextContent('Builder and technology leader')
    expect(screen.getByRole('link', { name: 'See my portfolio' })).toHaveAttribute('href', '/portfolio')
    // One under my name, one beside the favorite projects.
    expect(screen.getAllByRole('link', { name: 'All projects' }).map((link) => link.getAttribute('href'))).toEqual([
      '/projects',
      '/projects',
    ])
  })

  it('shows my three favorite projects under the skills until skills are picked', () => {
    renderAt('/')

    const shown = within(screen.getByRole('region', { name: 'Projects' }))
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
      .filter((href) => href.startsWith('/projects/'))
    expect(shown).toEqual(
      listedProjects
        .filter((project) => project.featured)
        .slice(0, 3)
        .map((project) => `/projects/${project.slug}`),
    )
  })

  it('shows a not-found page for unknown paths', () => {
    renderAt('/nowhere')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  // Cloud Run sleeps when idle, so every visit pings it right away, quietly,
  // to start it waking before anyone opens a project that needs it.
  it('quietly pings the API once when the site loads', async () => {
    const { fetch } = renderAt('/')

    await waitFor(() => expect(fetch.mock.calls.map(([url]) => url)).toEqual(['/api/health/']))
    expect(screen.queryByText(/API (online|offline)/)).not.toBeInTheDocument()
  })

  // Without the custom domain, Pages serves the site under /personal-site/,
  // which main.jsx gets from Vite's BASE_URL. Deep links must still route and fetch.
  it('loads a project page when the site is served under a base path', async () => {
    renderAt('/personal-site/projects/example', '/personal-site/')

    expect(await screen.findByText('First item')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Jacob Simerly' })).toHaveAttribute('href', '/personal-site/')
  })

  // Leaving the site should never replace it: every outside link opens in a
  // new tab, so the visitor can come back and keep exploring.
  it('opens every link that leaves the site in a new tab, on every page', () => {
    const pages = [
      '/',
      '/about',
      '/projects',
      '/resume',
      ...portfolio.map((piece) => `/portfolio?tab=${piece.slug}`),
      ...listedProjects.map((project) => `/projects/${project.slug}`),
    ]
    const seen = new Set()
    const sameTab = []
    for (const page of pages) {
      const { container, unmount } = renderAt(page)
      for (const link of container.querySelectorAll('a[href^="http"]')) {
        const href = link.getAttribute('href')
        seen.add(href)
        if (link.target !== '_blank' || link.rel !== 'noreferrer') sameTab.push(`${page}: ${href}`)
      }
      unmount()
    }

    expect(sameTab).toEqual([])
    // It did look at the kinds of outside links the site has.
    expect(seen).toContain('https://brolympics.app')
    expect(seen).toContain('https://github.com/jsimerly')
    expect(seen).toContain('https://github.com/jsimerly/ecs_engine')
    expect(seen).toContain('https://pypi.org/project/ecs-engine/')
  })
})
