import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { projects } from '../projects'
import { lastingSkills, skillCategories } from './skillCategories'
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

  it('keeps every skill that sticks around a real skill on the timeline, filed under a kind', () => {
    const onTimeline = new Set(skillTotals(journey).map(({ skill }) => skill))
    const filed = new Set(skillCategories.flatMap((category) => category.skills))

    expect(lastingSkills.filter((skill) => !onTimeline.has(skill) || !filed.has(skill))).toEqual([])
  })

  it('leads the sorted skills with leadership, Microsoft Fabric, AI, and data engineering', () => {
    expect(skillCategories.slice(0, 4).map((category) => category.name)).toEqual([
      'Leadership',
      'Microsoft Fabric',
      'AI',
      'Data Engineering',
    ])
  })

  // What a Fabric buyer should read first: leading projects, data engineering,
  // Fabric itself, and AI-assisted work, right behind Python.
  it('ends the journey with project leadership, data engineering, Fabric, and agentic development right behind Python', () => {
    const ranked = skillTotals(journey).sort((a, b) => b.points - a.points).map(({ skill }) => skill)

    expect(ranked.slice(0, 5)).toEqual([
      'Python',
      'Project Leadership',
      'Data Engineering',
      'Microsoft Fabric',
      'Agentic Development',
    ])
  })

  it('names the skills that stick around the way Fabric buyers name them, with no engineer-only leftovers', () => {
    const names = new Set(lastingSkills)

    for (const buyerWord of ['Lakehouse Architecture', 'Fabric Migration', 'Semantic Models', 'Governance & Compliance', 'Enablement']) {
      expect(names.has(buyerWord), buyerWord).toBe(true)
    }
    for (const retired of ['Data architecture', 'LLM APIs']) expect(names.has(retired), retired).toBe(false)
  })

  it('keeps how I ship (Git, GitHub, GitHub Actions, Google Cloud) and the math behind the models (Statistics, Linear Algebra) among the skills that stick around', () => {
    const names = new Set(lastingSkills)

    for (const skill of ['Git', 'GitHub', 'GitHub Actions', 'Google Cloud', 'Statistics', 'Linear Algebra']) {
      expect(names.has(skill), skill).toBe(true)
    }
  })

  // The chips are labels, so they read in title case (Data Engineering, Power
  // BI), the way LinkedIn and job postings write skills, and the way the
  // proper nouns among them already read. A name its makers write lowercase
  // (pytest) keeps its spelling.
  it('writes every skill and kind in title case, the way a label reads, except a name its makers write lowercase', () => {
    const lowercaseByDesign = new Set(['pytest'])
    const minor = new Set(['&', 'and', 'of'])
    const titleCase = (name) => name.split(' ').every((word) => minor.has(word) || /^[A-Z0-9]/.test(word))

    const names = [...skillCategories.map((category) => category.name), ...skillCategories.flatMap((category) => category.skills)]
    expect(names.filter((name) => !lowercaseByDesign.has(name) && !titleCase(name))).toEqual([])
    expect(names.filter((name) => /(and|And)/.test(name))).toEqual([])
  })

  // Picking a skill finds projects by their tags, by exact name, so a tag
  // spelled its own way (or in another case) would never be found.
  it('tags every project only with skills the basket knows, spelled the same way', () => {
    const filed = new Set(skillCategories.flatMap((category) => category.skills))

    const strays = projects.flatMap((project) => project.tags.filter((tag) => !filed.has(tag)).map((tag) => `${project.slug}: ${tag}`))

    expect(strays).toEqual([])
  })

  // Picking a skill that sticks around should always find work behind it.
  // (Curious is a mindset, not something a project is tagged with.)
  it('tags at least one project with every skill that sticks around, so picking it finds work', () => {
    const tagged = new Set(projects.flatMap((project) => project.tags))

    expect(lastingSkills.filter((skill) => skill !== 'Curious' && !tagged.has(skill))).toEqual([])
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
