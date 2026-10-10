import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { about } from '../content/about'
import { profile } from '../content/profile'
import About from './About.jsx'

describe('About', () => {
  it('shows each paragraph about me, in order, beside my photo', () => {
    const { container } = render(<About />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About me')
    expect([...container.querySelectorAll('h1 + div > p')].map((paragraph) => paragraph.textContent)).toEqual(about)
    expect(screen.getByRole('img', { name: 'Jacob Simerly' })).toHaveAttribute('src', '/jacob.jpg')
  })

  it('ships the photo the profile names in public/, so the build includes it', () => {
    // Tests run from frontend/, where Vite serves public/ at the site root.
    expect(profile.photo).toBe('jacob.jpg')
    expect(existsSync(resolve('public', profile.photo))).toBe(true)
  })
})
