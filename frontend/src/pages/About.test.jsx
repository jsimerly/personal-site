import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { about } from '../content/about'
import About from './About.jsx'

describe('About', () => {
  it('shows each paragraph about me, in order, beside my photo spot', () => {
    const { container } = render(<About />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About me')
    expect([...container.querySelectorAll('h1 + div > p')].map((paragraph) => paragraph.textContent)).toEqual(about)
    expect(container).toHaveTextContent('[Your photo]')
  })
})
