import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { profile } from '../content/profile'
import { education, experience, personalProjects, skills } from '../content/resume'
import ResumePrint from './ResumePrint.jsx'

describe('ResumePrint', () => {
  it('lays the whole resume out for paper: every role, highlight, skill group, school, and project', () => {
    render(<ResumePrint />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name)
    expect(screen.getByText('Senior Data Engineer · Indianapolis, IN')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 4 }).map((role) => role.textContent)).toEqual(
      experience.flatMap((job) => job.roles.map((role) => role.title)),
    )
    const highlights = [...experience.flatMap((job) => job.roles.flatMap((role) => role.highlights)), ...personalProjects.flatMap((p) => p.highlights)]
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(highlights)
    for (const group of skills) {
      expect(screen.getByText(group.group).nextSibling).toHaveTextContent(group.items.join(', '))
    }
    expect(screen.getByText(education[0].school)).toBeInTheDocument()
    expect(screen.getByText(`${education[0].degree}, ${education[0].minor}`)).toBeInTheDocument()
  })

  it('writes every link out as text, since paper has nothing to click', () => {
    render(<ResumePrint />)

    expect(screen.queryAllByRole('link')).toEqual([])
    expect(screen.getByText(/github\.com\/jsimerly\s+·\s+jacob-simerly\.com$/)).toBeInTheDocument()
    const fantasy = within(screen.getByText(personalProjects[0].name).parentElement)
    expect(fantasy.getByText('github.com/jsimerly/fantasy-analysis')).toBeInTheDocument()
  })

  it('shows only what the resume content holds: no phone number anywhere', () => {
    const { container } = render(<ResumePrint />)

    expect(container.textContent).not.toMatch(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/)
  })
})
