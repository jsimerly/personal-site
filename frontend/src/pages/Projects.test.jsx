import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { listedProjects } from '../projects'
import Projects from './Projects.jsx'

function Search() {
  return <output>{useLocation().search}</output>
}

function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/projects"
          element={
            <>
              <Projects />
              <Search />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

// The gallery's cards, by the page each one opens.
const cards = () =>
  screen
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))
    .filter((href) => href.startsWith('/projects/'))
const slugsOf = (kind) => listedProjects.filter((project) => kind === 'all' || project.kind === kind).map((project) => `/projects/${project.slug}`)

describe('Projects', () => {
  it('shows every listed project, with a count on each filter', () => {
    renderAt('/projects')

    expect(cards()).toEqual(slugsOf('all'))
    const filters = within(screen.getByRole('group', { name: 'Filter projects' })).getAllByRole('button')
    expect(filters.map((filter) => filter.textContent)).toEqual([
      `All ${slugsOf('all').length}`,
      `Work ${slugsOf('work').length}`,
      `Personal ${slugsOf('personal').length}`,
    ])
  })

  it('offers no filter for a kind nothing is filed under, so none opens on an empty gallery', () => {
    renderAt('/projects')

    // Nothing from school is in the gallery yet.
    expect(slugsOf('school')).toEqual([])
    expect(screen.queryByRole('button', { name: /^School/ })).not.toBeInTheDocument()
  })

  it('filters by kind and keeps the filter in the URL, so a filtered view can be shared', async () => {
    renderAt('/projects')

    await userEvent.click(screen.getByRole('button', { name: /^Work/ }))

    expect(cards()).toEqual(slugsOf('work'))
    expect(screen.getByRole('button', { name: /^Work/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('?kind=work')

    await userEvent.click(screen.getByRole('button', { name: /^All/ }))
    expect(cards()).toEqual(slugsOf('all'))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('opens straight to the filter named in the URL', () => {
    renderAt('/projects?kind=personal')

    expect(cards()).toEqual(slugsOf('personal'))
    expect(screen.getByRole('button', { name: /^Personal/ })).toHaveAttribute('aria-pressed', 'true')
  })
})
