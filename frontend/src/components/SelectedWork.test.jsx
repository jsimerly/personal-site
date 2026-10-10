import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { selectedWork } from '../content/selectedWork'
import { projects } from '../projects'
import SelectedWork from './SelectedWork.jsx'

// The cards, each the list item holding a project's heading.
function renderCards() {
  render(
    <MemoryRouter>
      <SelectedWork />
    </MemoryRouter>,
  )
  return screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.closest('li'))
}

describe('SelectedWork', () => {
  it('points every piece of selected work at a project that exists', () => {
    const slugs = new Set(projects.map((project) => project.slug))

    expect(selectedWork.filter((work) => !slugs.has(work.project)).map((work) => work.project)).toEqual([])
  })

  it('shows where each piece was done, what changed, and its first three skills, opening its project page', () => {
    const [first] = renderCards()

    expect(within(first).getByRole('link', { name: 'SOX-Compliant CI/CD for Microsoft Fabric' })).toHaveAttribute(
      'href',
      '/projects/lilly-fabric-cicd',
    )
    expect(first).toHaveTextContent(
      "Eli LillySOX-Compliant CI/CD for Microsoft FabricLilly's first GitHub-native CI/CD for Microsoft Fabric, with the approval gates and segregation of duties that brought deployments under SOX.CI/CDGitHub ActionsMicrosoft Fabric",
    )
  })

  it('offers a live link only for work you can try', () => {
    const cards = renderCards()

    const live = cards.map((card) => within(card).queryByRole('link', { name: 'Explore it live' })?.getAttribute('href') ?? null)
    expect(live).toEqual([null, null, null, '/fantasy-analysis'])
  })
})
