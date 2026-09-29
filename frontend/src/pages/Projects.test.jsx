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
      `School ${slugsOf('school').length}`,
      `Personal ${slugsOf('personal').length}`,
    ])
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
    renderAt('/projects?kind=school')

    expect(cards()).toEqual(slugsOf('school'))
  })
})
