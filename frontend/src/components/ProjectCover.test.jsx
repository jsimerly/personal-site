import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '../projects'
import ProjectCover from './ProjectCover.jsx'

describe('ProjectCover', () => {
  // A cover path relative to the page would break on /projects/<slug>, so
  // it is resolved from the site root.
  it("shows a project's cover image when it has one, from the site root", () => {
    const { container } = render(<ProjectCover project={{ slug: 'rune', name: 'Rune', cover: 'covers/rune.png' }} />)

    expect(container.querySelector('img')).toHaveAttribute('src', '/covers/rune.png')
  })

  it('has every cover a project names in public/, so the build ships it', () => {
    // Tests run from frontend/, where Vite serves public/ at the site root.
    const covers = projects.filter((project) => project.cover).map((project) => project.cover)

    expect(covers).toEqual(['covers/ele-cards.jpg'])
    expect(covers.filter((cover) => !existsSync(resolve('public', cover)))).toEqual([])
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
