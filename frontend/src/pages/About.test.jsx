import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { about } from '../content/about'
import { profile } from '../content/profile'
import About from './About.jsx'

describe('About', () => {
  // The photos are content that comes and goes, so these set them themselves.
  const withPhotos = (photos, run) => {
    const saved = about.photos
    about.photos = photos
    try {
      run()
    } finally {
      about.photos = saved
    }
  }

  it('opens with the intro beside my photo, then every fact with its label, in order', () => {
    const { container } = render(<About />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About me')
    expect([...container.querySelectorAll('h1 + div > p')].map((paragraph) => paragraph.textContent)).toEqual(about.intro)
    expect(screen.getByRole('img', { name: 'Jacob Simerly' })).toHaveAttribute('src', '/jacob.jpg')
    expect([...container.querySelectorAll('dt')].map((term) => term.textContent)).toEqual(about.facts.map((fact) => fact.label))
    expect([...container.querySelectorAll('dd')].map((detail) => detail.textContent)).toEqual(about.facts.map((fact) => fact.value))
  })

  it('shows no photo grid until there are photos', () => {
    withPhotos([], () => {
      render(<About />)

      expect(screen.queryByRole('list', { name: 'Photos' })).not.toBeInTheDocument()
    })
  })

  it('shows each photo with its words, in order, loaded only when scrolled to', () => {
    withPhotos(
      [
        { file: 'about/draft.jpg', alt: 'Draft night' },
        { file: 'about/brolympics.jpg', alt: 'Brolympics, the cornhole final' },
      ],
      () => {
        render(<About />)

        const photos = within(screen.getByRole('list', { name: 'Photos' })).getAllByRole('img')
        expect(photos.map((photo) => [photo.getAttribute('src'), photo.getAttribute('alt'), photo.getAttribute('loading')])).toEqual([
          ['/about/draft.jpg', 'Draft night', 'lazy'],
          ['/about/brolympics.jpg', 'Brolympics, the cornhole final', 'lazy'],
        ])
      },
    )
  })

  it('has every photo the page names in public/, so the build ships it', () => {
    // Tests run from frontend/, where Vite serves public/ at the site root.
    const missing = about.photos.map((photo) => photo.file).filter((file) => !existsSync(resolve('public', file)))

    expect(missing).toEqual([])
  })

  it('leaves no placeholder copy on the page', () => {
    const copy = [...about.intro, ...about.facts.flatMap((fact) => [fact.label, fact.value]), ...about.photos.map((photo) => photo.alt)]

    expect(copy.filter((text) => /\[Placeholder/.test(text))).toEqual([])
  })

  it('ships the photo the profile names in public/, so the build includes it', () => {
    expect(profile.photo).toBe('jacob.jpg')
    expect(existsSync(resolve('public', profile.photo))).toBe(true)
  })
})
