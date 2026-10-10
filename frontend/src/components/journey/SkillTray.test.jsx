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

  it('settles open once the journey is complete: the skills that stick around first, biggest first, the rest faded', () => {
    const python = { skill: 'Python', points: 8, work: 4, build: 4 }
    render(<SkillTray totals={[...totals, python]} complete />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(skillsShown()).toEqual(['Python', 'Curious', 'C++', 'Visual Basic'])
    const item = (name) => within(screen.getByRole('list')).getByText(name)
    expect(item('C++').style).toMatchObject({ color: 'var(--color-zinc-500)', backgroundColor: 'transparent', fontSize: '12px' })
    expect(item('Python').style.color).toBe('')
  })

  it('invites scrolling before anything is collected', () => {
    render(<SkillTray totals={[]} complete={false} />)

    expect(screen.getByText('Scroll the timeline to start collecting.')).toBeInTheDocument()
  })
})
