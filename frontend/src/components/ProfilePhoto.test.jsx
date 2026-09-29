import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProfilePhoto from './ProfilePhoto.jsx'

describe('ProfilePhoto', () => {
  it('shows the photo from public/ under the site base, described by name', () => {
    render(<ProfilePhoto src="jacob.jpg" name="Jacob Simerly" />)

    expect(screen.getByRole('img', { name: 'Jacob Simerly' })).toHaveAttribute('src', '/jacob.jpg')
  })

  it('holds the initials and a marked spot until there is a photo', () => {
    const { container } = render(<ProfilePhoto src={null} name="Jacob Simerly" />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container).toHaveTextContent('JS[Your photo]')
  })
})
