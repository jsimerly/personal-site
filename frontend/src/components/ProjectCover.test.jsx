import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectCover from './ProjectCover.jsx'

describe('ProjectCover', () => {
  it("shows a project's cover image when it has one", () => {
    const { container } = render(<ProjectCover project={{ slug: 'rune', name: 'Rune', cover: '/rune.png' }} />)

    expect(container.querySelector('img')).toHaveAttribute('src', '/rune.png')
  })

  it('stands in with its initials on a flat color, the same color every time, until it has one', () => {
    const first = render(<ProjectCover project={{ slug: 'fantasy-analysis', name: 'Fantasy Analysis' }} />)
    const cover = first.container.firstChild
    expect(cover).toHaveTextContent('FA')
    expect(cover.getAttribute('style')).toMatch(/^background-color: oklch\(0\.42 0\.06 \d+\);$/)

    const again = render(<ProjectCover project={{ slug: 'fantasy-analysis', name: 'Fantasy Analysis' }} />)
    expect(again.container.firstChild.getAttribute('style')).toBe(cover.getAttribute('style'))
  })
})
