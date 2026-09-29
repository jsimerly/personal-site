import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { portfolio } from '../content/portfolio'
import { projects } from '../projects'
import Portfolio from './Portfolio.jsx'

// Shows the current query string, so tests can see what the URL holds.
function Search() {
  return <output>{useLocation().search}</output>
}

function renderAt(path = '/portfolio') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/portfolio"
          element={
            <>
              <Portfolio />
              <Search />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

const panelHeading = () => within(screen.getByRole('tabpanel')).getByRole('heading', { level: 2 })
const selectedTab = () => screen.getByRole('tab', { selected: true })

describe('Portfolio', () => {
  it('offers one tab per piece, in order, with coming-soon ones marked, and opens on the first', () => {
    renderAt()

    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Brolympics',
      'Fantasy Football Engineering Soon(coming soon)',
      'Agentic Investing Soon(coming soon)',
    ])
    expect(selectedTab()).toHaveAccessibleName('Brolympics')
    expect(panelHeading()).toHaveTextContent('Brolympics')
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Brolympics')
  })

  it("shows a ready piece's project, with a link to try it", () => {
    renderAt()

    expect(screen.getByRole('link', { name: 'Visit the site' })).toHaveAttribute('href', 'https://brolympics.app')
  })

  it('switches pieces when a tab is clicked, and keeps the choice in the URL', async () => {
    renderAt()

    await userEvent.click(screen.getByRole('tab', { name: 'Agentic Investing (coming soon)' }))

    expect(panelHeading()).toHaveTextContent('Agentic Investing')
    expect(within(screen.getByRole('tabpanel')).getByText('Coming soon')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('?tab=agentic-investing')

    await userEvent.click(screen.getByRole('tab', { name: 'Brolympics' }))

    expect(panelHeading()).toHaveTextContent('Brolympics')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('opens straight to the tab named in the URL', () => {
    renderAt('/portfolio?tab=fantasy-football')

    expect(selectedTab()).toHaveAccessibleName('Fantasy Football Engineering (coming soon)')
    expect(panelHeading()).toHaveTextContent('Fantasy Football Engineering')
  })

  it('falls back to the first tab when the URL names one that does not exist', () => {
    renderAt('/portfolio?tab=nope')

    expect(selectedTab()).toHaveAccessibleName('Brolympics')
  })

  it('moves between tabs with the arrow keys, Home, and End, wrapping at the ends', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('tab', { name: 'Brolympics' }))

    await userEvent.keyboard('{ArrowLeft}')
    expect(selectedTab()).toHaveAccessibleName('Agentic Investing (coming soon)')
    expect(selectedTab()).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')
    expect(selectedTab()).toHaveAccessibleName('Brolympics')

    await userEvent.keyboard('{ArrowRight}')
    expect(selectedTab()).toHaveAccessibleName('Fantasy Football Engineering (coming soon)')
    expect(selectedTab()).toHaveFocus()

    await userEvent.keyboard('{End}')
    expect(selectedTab()).toHaveAccessibleName('Agentic Investing (coming soon)')

    await userEvent.keyboard('{Home}')
    expect(selectedTab()).toHaveAccessibleName('Brolympics')
    expect(selectedTab()).toHaveFocus()
  })

  it('points every ready piece at a project that exists', () => {
    const slugs = new Set(projects.map((project) => project.slug))

    const broken = portfolio.filter((piece) => !piece.soon && !slugs.has(piece.project)).map((piece) => piece.name)

    expect(broken).toEqual([])
  })
})
