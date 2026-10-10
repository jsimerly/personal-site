import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { projects } from '../projects'
import { skillCategories } from './skillCategories'
import { journey, skillTotals } from './journey'

describe('journey', () => {
  it('links every timeline card that names a project to a page that exists', () => {
    const slugs = new Set(projects.map((project) => project.slug))

    const broken = journey.filter((entry) => entry.project && !slugs.has(entry.project)).map((entry) => entry.title)

    expect(broken).toEqual([])
  })

  it('gives every personal build on the timeline a project page', () => {
    const unlinked = journey.filter((entry) => entry.side === 'build' && !entry.project).map((entry) => entry.title)

    expect(unlinked).toEqual([])
  })

  it('gives every project from a job a page too, so work skills find their projects', () => {
    const unlinked = journey.filter((entry) => entry.position && !entry.project).map((entry) => entry.title)

    expect(unlinked).toEqual([])
  })

  it('writes every project name and timeline title in title case, since they are titles', () => {
    // Small words stay lowercase in the middle of a title; every other word,
    // and the first and last, starts with a capital.
    const minor = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'at', 'by', 'in', 'of', 'on', 'to', 'with', 'as'])
    const sentenceCase = (title) => {
      const words = title.split(' ')
      return words.some((word, i) => /^[a-z]/.test(word) && !(i > 0 && i < words.length - 1 && minor.has(word)))
    }

    const titles = [...projects.map((project) => project.name), ...journey.map((entry) => entry.title)]
    expect(titles.filter(sentenceCase)).toEqual([])
  })

  it('leaves no placeholder copy on the timeline', () => {
    const placeholders = journey.filter((entry) => /\[Placeholder/.test(`${entry.title} ${entry.summary ?? ''}`))

    expect(placeholders.map((entry) => entry.title)).toEqual([])
  })

  it('files every skill on the timeline under a kind, so none lands in "Other" when the basket sorts', () => {
    const filed = new Set(skillCategories.flatMap((category) => category.skills))

    const unfiled = skillTotals(journey).map(({ skill }) => skill).filter((skill) => !filed.has(skill))

    expect(unfiled).toEqual([])
  })

  it('runs oldest first, however the entries are written', () => {
    const dates = journey.map((entry) => entry.date)

    expect(dates).toEqual([...dates].sort())
  })

  it('keeps entries from the same month in the order they are written', () => {
    const titles = journey.map((entry) => entry.title)

    // Both January 2022: the training program is written first, then Dominion.
    expect(titles.indexOf('A New Training Program')).toBeLessThan(titles.indexOf('Dominion'))
    expect(titles.indexOf('Dominion')).toBe(titles.indexOf('Dominion AI') - 1)
  })

  it('starts the basket with Curious alone, purple, before any entry', () => {
    expect(skillTotals([])).toEqual([{ skill: 'Curious', points: 3, work: 1.5, build: 1.5 }])
  })

  it('keeps Curious first as the rest of the skills join', () => {
    const first = journey.findIndex((entry) => Object.keys(entry.skills).length)

    expect(skillTotals(journey.slice(0, first + 1)).map(({ skill }) => skill)).toEqual([
      'Curious',
      ...Object.keys(journey[first].skills),
    ])
  })

  it('has every logo a card names in public/, so the build ships it', () => {
    const logos = [...new Set(journey.flatMap((entry) => [...(entry.logos ?? []), ...(entry.position?.logos ?? [])]))]
    // Tests run from frontend/, where Vite serves public/ at the site root.
    const missing = logos.filter((logo) => !existsSync(resolve('public', logo)))

    expect(missing).toEqual([])
    expect(logos).toEqual([
      'logos/indiana.svg',
      'logos/ball-state.svg',
      'logos/sigma-chi-shield.png',
      'logos/anthem.svg',
      'logos/ukg.svg',
      'logos/barnes-thornburg.svg',
      'logos/eli-lilly.svg',
    ])
  })
})
