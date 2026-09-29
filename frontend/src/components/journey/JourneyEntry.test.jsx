import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import JourneyEntry from './JourneyEntry.jsx'

const entry = { date: '2024-02', side: 'build', title: 'ECS Engine', skills: { Python: 1 } }

function renderEntry(overrides, position) {
  return render(
    <MemoryRouter>
      <ol>
        <JourneyEntry
          entry={{ ...entry, ...overrides }}
          index={0}
          newSkills={new Set()}
          position={position}
          revealed
          passed
        />
      </ol>
    </MemoryRouter>,
  )
}

describe('JourneyEntry', () => {
  it('makes the whole card a link to its project page, named by its title', () => {
    renderEntry({ project: 'ecs-engine' })

    const link = screen.getByRole('link', { name: 'ECS Engine' })
    expect(link).toHaveAttribute('href', '/projects/ecs-engine')
    // The link's hit area is stretched over the card by its ::after box.
    expect(link).toHaveClass('after:absolute', 'after:inset-0')
    expect(link.closest('article')).toHaveClass('relative')
  })

  it('shows the logos greyed out above the card, in order, hidden from screen readers', () => {
    const { container } = renderEntry({
      side: 'work',
      title: 'B.S.',
      logos: ['logos/indiana.svg', 'logos/ball-state.svg'],
    })

    const logos = [...container.querySelectorAll('img')]
    expect(logos.map((logo) => logo.getAttribute('src'))).toEqual(['/logos/indiana.svg', '/logos/ball-state.svg'])
    for (const logo of logos) {
      expect(logo).toHaveAttribute('alt', '')
      expect(logo).toHaveClass('brightness-0', 'invert', 'opacity-35')
      expect(logo.closest('article')).toBeNull()
    }
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows a newly picked-up skill by its color alone, with no plus sign', () => {
    render(
      <MemoryRouter>
        <ol>
          <JourneyEntry
            entry={{ ...entry, skills: { Python: 1, Rust: 2 } }}
            index={0}
            newSkills={new Set(['Rust'])}
            revealed
            passed
          />
        </ol>
      </MemoryRouter>,
    )

    const chips = within(screen.getByRole('list', { name: 'Skills' })).getAllByRole('listitem')
    expect(chips.map((chip) => chip.textContent)).toEqual(['Python', 'New skill: Rust'])
    expect(chips[1]).toHaveClass('text-build')
  })

  it('puts the position beside its logo above the card, and leaves the dates off the project card', () => {
    const position = {
      logos: ['logos/ukg.svg'],
      title: 'Solutions Consultant (Team Lead)',
      start: '2021-01',
      end: '2022-12',
    }
    const { container } = renderEntry({ side: 'work', title: 'Customer SaaS implementations', position }, position)

    const header = container.querySelector('img').parentElement
    expect(header.closest('article')).toBeNull()
    expect(header).toHaveTextContent('Solutions Consultant (Team Lead)Jan 2021 – Dec 2022')
    expect(container.querySelector('article')).toHaveTextContent(/^Customer SaaS implementations/)
    expect(container.querySelector('article time')).toBeNull()
  })

  it('shows nothing above a later card from the same position', () => {
    const position = { logos: ['logos/ukg.svg'], title: 'Solutions Consultant (Team Lead)', start: '2021-01' }
    const { container } = renderEntry({ side: 'work', title: 'Training new consultants', position })

    expect(container.querySelector('img')).toBeNull()
    expect(container).not.toHaveTextContent('Solutions Consultant')
  })

  it('leaves a card with no project page as plain text', () => {
    renderEntry({ side: 'work', title: 'Data Analyst' })

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Data Analyst' })).toBeInTheDocument()
  })
})
