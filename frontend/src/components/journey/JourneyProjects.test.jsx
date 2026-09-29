import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { listedProjects } from '../../projects'
import JourneyProjects from './JourneyProjects.jsx'
import { relevantProjects } from './related'

function renderProjects(picked) {
  const onClear = vi.fn()
  render(
    <MemoryRouter>
      <JourneyProjects picked={picked} onClear={onClear} />
    </MemoryRouter>,
  )
  return onClear
}

const cardLinks = () =>
  within(screen.getByRole('region', { name: 'Projects' }))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))
    .filter((href) => href.startsWith('/projects/'))

describe('JourneyProjects', () => {
  it('invites picking skills while showing the favorites', () => {
    renderProjects([])

    expect(screen.getByText('Pick skills above to see where I’ve put them to work.')).toBeInTheDocument()
    expect(cardLinks()).toHaveLength(3)
  })

  it('shows the projects behind the picked skills, with a way back to the favorites', async () => {
    const onClear = renderProjects(['Django', 'React'])

    expect(screen.getByText("Where I've used Django and React")).toBeInTheDocument()
    expect(cardLinks()).toEqual(
      relevantProjects(listedProjects, ['Django', 'React']).map((project) => `/projects/${project.slug}`),
    )

    await userEvent.click(screen.getByRole('button', { name: 'Show favorites' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('says so plainly when nothing in the gallery uses the picked skills', () => {
    renderProjects(['Curious'])

    expect(screen.getByText('Nothing in the gallery with Curious yet.')).toBeInTheDocument()
    expect(cardLinks()).toEqual([])
  })
})
