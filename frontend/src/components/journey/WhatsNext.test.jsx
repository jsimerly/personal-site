import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import WhatsNext from './WhatsNext.jsx'

describe('WhatsNext', () => {
  it('offers one way forward at the end of the page: the open contact field, with no links away', () => {
    render(
      <MemoryRouter>
        <WhatsNext />
      </MemoryRouter>,
    )
    const end = within(screen.getByRole('region', { name: 'Want to build something together?' }))

    expect(end.getByRole('textbox', { name: 'Your email or phone' })).toBeInTheDocument()
    expect(end.queryAllByRole('link')).toEqual([])
    expect(end.getAllByRole('button').map((button) => button.getAttribute('aria-label') ?? button.textContent)).toEqual(['Send'])
  })
})
