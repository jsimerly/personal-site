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

  it('assembles the rows from the bottom up, so the top rows land last', () => {
    // SQL is the top row here (Languages), Curious the bottom one (Mindset, last).
    const { container, rerender } = render(
      <BubbleCluster totals={totals} sortProgress={0} popDelay={0} width={320} sortedWidth={1024} picked={[]} onToggle={() => {}} />,
    )
    const placeOf = (skill) => container.querySelector(`[data-basket-skill="${skill}"]`).style.transform
    const cloud = { Curious: placeOf('Curious'), SQL: placeOf('SQL') }

    rerender(
      <BubbleCluster totals={totals} sortProgress={0.3} popDelay={0} width={320} sortedWidth={1024} picked={[]} onToggle={() => {}} />,
    )

    expect(placeOf('Curious')).not.toBe(cloud.Curious)
    expect(placeOf('SQL')).toBe(cloud.SQL)
  })

  // The cards scroll past on either side of the cloud's column. A bubble that
  // set off straight for its place in a row could cut across the corner of a
  // card still on screen, so it moves to its row's level first, then slides.
  it("sinks a bubble to its row's level inside the cloud's column before sliding it sideways, clear of the cards beside the cloud", () => {
    const at = (sortProgress) => (
      <BubbleCluster totals={totals} sortProgress={sortProgress} popDelay={0} width={320} sortedWidth={1024} picked={[]} onToggle={() => {}} />
    )
    const { container, rerender } = render(at(0))
    const centerOf = (skill) => {
      const bubble = container.querySelector(`[data-basket-skill="${skill}"]`)
      const [, x, y] = bubble.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/).map(Number)
      const button = bubble.querySelector('button')
      return { x: x + parseFloat(button.style.width) / 2, y: y + parseFloat(button.style.height) / 2 }
    }
    const cloud = centerOf('Curious')

    // Curious's row (the bottom one) is a fifth of the way to landing.
    rerender(at(0.15))
    const sinking = centerOf('Curious')
    expect(sinking.x).toBeCloseTo(cloud.x, 6)
    expect(Math.abs(sinking.y - cloud.y)).toBeGreaterThan(2)

    // Most of the way there, it has slid out toward its place in the row.
    rerender(at(0.3))
    expect(Math.abs(centerOf('Curious').x - cloud.x)).toBeGreaterThan(100)
  })

  it('once sorted, keeps the skills that stick around purple and bigger, and fades the rest to grey', () => {
    const withReact = [...totals, { skill: 'React', points: 8, work: 0, build: 8 }]
    render(<BubbleCluster totals={withReact} sortProgress={1} popDelay={0} width={320} sortedWidth={1024} picked={[]} onToggle={() => {}} />)

    const react = screen.getByRole('button', { name: 'React' })
    const python = screen.getByRole('button', { name: 'Python' })
    expect(react.style).toMatchObject({ color: 'var(--color-zinc-500)', backgroundColor: 'transparent', fontSize: '12px' })
    expect(python.style.color).toBe('')
    expect(parseFloat(python.style.fontSize)).toBeGreaterThanOrEqual(14)
    // Faded is still a skill you can pick.
    expect(react).toBeEnabled()
  })

  it('brings in the heading and the kinds of skill as it sorts, still not clickable', () => {
    renderCluster({ sortProgress: 0.8 })

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
