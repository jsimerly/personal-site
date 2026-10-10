import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { about } from '../content/about'
import { profile } from '../content/profile'
import About from './About.jsx'

describe('About', () => {
  // The photos are content that comes and goes, so these set them themselves.
  const withPhotos = (title, photos, run) => {
    const section = about.sections.find((candidate) => candidate.title === title)
    const saved = section.photos
    section.photos = photos
    try {
      run()
    } finally {
      section.photos = saved
    }
  }

  it('opens with the intro beside my photo', () => {
    const { container } = render(<About />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About')
    expect([...container.querySelectorAll('h1 + div > p')].map((paragraph) => paragraph.textContent)).toEqual(about.intro)
    expect(screen.getByRole('img', { name: 'Jacob Simerly' })).toHaveAttribute('src', '/jacob.jpg')
  })

  it('then has a section each for the basics and the hobbies, every fact under its label, in order', () => {
    render(<About />)

    const sections = screen.getAllByRole('region')
    expect(sections.map((section) => within(section).getByRole('heading', { level: 2 }).textContent)).toEqual(['About me', 'Hobbies'])
    sections.forEach((section, index) => {
      const { facts } = about.sections[index]
      expect([...section.querySelectorAll('dt')].map((term) => term.textContent)).toEqual(facts.map((fact) => fact.label))
      expect([...section.querySelectorAll('dd')].map((detail) => detail.textContent)).toEqual(facts.map((fact) => fact.value))
    })
    expect(about.sections[0].facts.map((fact) => fact.label)).toEqual(['Home', 'School', 'Married'])
  })

  it('shows no photo row in a section until it has photos', () => {
    withPhotos('Hobbies', [], () => {
      render(<About />)

      expect(screen.queryByRole('list', { name: 'Hobbies photos' })).not.toBeInTheDocument()
    })
  })

  it("shows a section's photos under its facts with their words, in order, loaded only when scrolled to", () => {
    withPhotos(
      'Hobbies',
      [
        { file: 'about/draft-night.jpg', alt: 'Draft night' },
        { file: 'about/brolympics.jpg', alt: 'Brolympics, the cornhole final' },
      ],
      () => {
        render(<About />)

        const hobbies = screen.getByRole('region', { name: 'Hobbies' })
        const photos = within(within(hobbies).getByRole('list', { name: 'Hobbies photos' })).getAllByRole('img')
        expect(photos.map((photo) => [photo.getAttribute('src'), photo.getAttribute('alt'), photo.getAttribute('loading')])).toEqual([
          ['/about/draft-night.jpg', 'Draft night', 'lazy'],
          ['/about/brolympics.jpg', 'Brolympics, the cornhole final', 'lazy'],
        ])
        expect(screen.queryByRole('list', { name: 'About me photos' })).not.toBeInTheDocument()
      },
    )
  })

  it('has every photo the page names in public/, so the build ships it', () => {
    // Tests run from frontend/, where Vite serves public/ at the site root.
    const files = about.sections.flatMap((section) => section.photos.map((photo) => photo.file))

    expect(files.filter((file) => !existsSync(resolve('public', file)))).toEqual([])
  })

  it('leaves no placeholder copy on the page', () => {
    const copy = [
      ...about.intro,
      ...about.sections.flatMap((section) => [
        section.title,
        ...section.facts.flatMap((fact) => [fact.label, fact.value]),
        ...section.photos.map((photo) => photo.alt),
      ]),
    ]

    expect(copy.filter((text) => /\[Placeholder/.test(text))).toEqual([])
  })

  it('ships the photo the profile names in public/, so the build includes it', () => {
    expect(profile.photo).toBe('jacob.jpg')
    expect(existsSync(resolve('public', profile.photo))).toBe(true)
  })
})
