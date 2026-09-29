import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BubbleCluster from './BubbleCluster.jsx'

const totals = [
  { skill: 'Curious', points: 3, work: 1.5, build: 1.5 },
  { skill: 'Python', points: 8, work: 4, build: 4 },
  { skill: 'SQL', points: 4, work: 4, build: 0 },
]

function renderCluster(props) {
  const onToggle = vi.fn()
  render(
    <BubbleCluster
      totals={totals}
      sortProgress={0}
      popDelay={0}
      width={320}
      sortedWidth={1024}
      picked={[]}
      onToggle={onToggle}
      {...props}
    />,
  )
  return onToggle
}

describe('BubbleCluster', () => {
  it('floats as a plain cloud of skills, not yet clickable, while the timeline scrolls', () => {
    renderCluster({ sortProgress: 0 })

    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'What I bring today' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => [button.textContent, button.disabled])).toEqual([
      ['Curious', true],
      ['Python', true],
      ['SQL', true],
    ])
  })

  it('brings in the heading and the kinds of skill as it sorts, still not clickable', () => {
    renderCluster({ sortProgress: 0.6 })

    expect(screen.getByRole('heading', { name: 'What I bring today' })).toBeInTheDocument()
    expect(screen.getAllByRole('button').every((button) => button.disabled)).toBe(true)
  })

  it('lets any skill be picked once every row has landed', async () => {
    const onToggle = renderCluster({ sortProgress: 1 })

    await userEvent.click(screen.getByRole('button', { name: 'Python' }))

    expect(onToggle).toHaveBeenCalledWith('Python')
    expect(screen.getByRole('list', { name: 'Skills: pick one or more to see related projects' })).toBeInTheDocument()
  })

  it('shows which skills are picked, and steps the rest back', () => {
    renderCluster({ sortProgress: 1, picked: ['Python'] })

    expect(screen.getAllByRole('button').map((button) => button.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
      'false',
    ])
    expect(screen.getByRole('button', { name: 'SQL' })).toHaveStyle({ opacity: '0.5' })
    expect(screen.getByRole('button', { name: 'Python' })).not.toHaveStyle({ opacity: '0.5' })
  })
})
