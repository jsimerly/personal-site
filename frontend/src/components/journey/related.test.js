import { describe, expect, it } from 'vitest'
import { listOf, relevantProjects } from './related'

const project = (name, tags, featured = false) => ({ name, tags, featured })

const PROJECTS = [
  project('Hobby app', ['React', 'Python']),
  project('Work platform', ['Python', 'AWS', 'React'], true),
  project('Report', ['SQL', 'Python'], true),
  project('Capstone', ['Java'], true),
  project('Script', ['Python']),
]

const names = (projects) => projects.map(({ name }) => name)

describe('relevantProjects', () => {
  it('shows the first three favorites before anything is picked', () => {
    expect(names(relevantProjects(PROJECTS, []))).toEqual(['Work platform', 'Report', 'Capstone'])
  })

  it('ranks projects using more of the picked skills first, favorites winning ties', () => {
    expect(names(relevantProjects(PROJECTS, ['Python', 'React']))).toEqual(['Work platform', 'Hobby app', 'Report'])
  })

  it('never shows more than three, even when more match', () => {
    expect(relevantProjects(PROJECTS, ['Python'])).toHaveLength(3)
    expect(names(relevantProjects(PROJECTS, ['Python']))).toEqual(['Work platform', 'Report', 'Hobby app'])
  })

  it('shows nothing when no project uses the picked skills', () => {
    expect(relevantProjects(PROJECTS, ['Rust'])).toEqual([])
  })
})

describe('listOf', () => {
  it('reads naturally for one, two, and several skills', () => {
    expect(listOf(['Python'])).toBe('Python')
    expect(listOf(['Python', 'React'])).toBe('Python and React')
    expect(listOf(['Python', 'React', 'SQL'])).toBe('Python, React, and SQL')
  })
})
