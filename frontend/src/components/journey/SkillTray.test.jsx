import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import SkillTray from './SkillTray.jsx'

const totals = [
  { skill: 'Curious', points: 3, work: 1.5, build: 1.5 },
  { skill: 'C++', points: 1, work: 0, build: 1 },
  { skill: 'Visual Basic', points: 1, work: 0, build: 1 },
]
const skillsShown = () => within(screen.getByRole('list')).getAllByRole('listitem').map((item) => item.textContent)

describe('SkillTray', () => {
  it('shows the newest skill first while the timeline scrolls, and opens up on request', async () => {
    render(<SkillTray totals={totals} complete={false} />)

    expect(skillsShown()).toEqual(['Visual Basic', 'C++', 'Curious'])

    await userEvent.click(screen.getByRole('button', { name: 'Show all skills' }))

    expect(screen.getByRole('button', { name: 'Show fewer skills' })).toHaveAttribute('aria-expanded', 'true')
    expect(skillsShown()).toEqual(['Curious', 'C++', 'Visual Basic'])
  })

  it('settles open, in the order they were picked up, once the journey is complete', () => {
    render(<SkillTray totals={totals} complete />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(skillsShown()).toEqual(['Curious', 'C++', 'Visual Basic'])
  })

  it('invites scrolling before anything is collected', () => {
    render(<SkillTray totals={[]} complete={false} />)

    expect(screen.getByText('Scroll the timeline to start collecting.')).toBeInTheDocument()
  })
})
