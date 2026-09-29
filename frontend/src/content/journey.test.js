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

  it('files every skill on the timeline under a kind, so none lands in "Other" when the basket sorts', () => {
    const filed = new Set(skillCategories.flatMap((category) => category.skills))

    const unfiled = skillTotals(journey).map(({ skill }) => skill).filter((skill) => !filed.has(skill))

    expect(unfiled).toEqual([])
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
