import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { profile } from '../content/profile'
import { experience } from '../content/resume'
import Resume from './Resume.jsx'

function renderResume() {
  return render(
    <MemoryRouter>
      <Resume />
    </MemoryRouter>,
  )
}

describe('Resume', () => {
  // The PDF is content that comes and goes, so these set it themselves.
  const withPdf = (pdf, run) => {
    const saved = profile.resumePdf
    profile.resumePdf = pdf
    try {
      run()
    } finally {
      profile.resumePdf = saved
    }
  }

  it('offers the resume PDF as a download, named for me, when there is one', () => {
    withPdf('jacob-simerly-resume.pdf', () => {
      renderResume()

      const download = screen.getByRole('link', { name: 'Download resume' })
      expect(download).toHaveAttribute('href', '/jacob-simerly-resume.pdf')
      expect(download).toHaveAttribute('download', 'Jacob Simerly - Resume.pdf')
    })
  })

  it('shows no download until there is a PDF', () => {
    withPdf(null, () => {
      renderResume()

      expect(screen.queryByRole('link', { name: 'Download resume' })).not.toBeInTheDocument()
    })
  })

  // The PDF isn't a file in the repo: the build prints it from the resume
  // content (scripts/build-resume-pdf.mjs), and the e2e lane downloads and
  // reads it. What matters here is that the page offers it.
  it('offers the PDF the build prints', () => {
    expect(profile.resumePdf).toBe('jacob-simerly-resume.pdf')
  })

  it('puts my current role and where I live under my name', () => {
    renderResume()

    expect(screen.getByText('Senior Data Engineer · Indianapolis, IN')).toBeInTheDocument()
  })

  it('lists every role newest first, each under its company', () => {
    renderResume()

    const roles = screen.getAllByRole('heading', { level: 4 })
    expect(roles.map((role) => role.textContent)).toEqual(
      experience.flatMap((job) => job.roles.map((role) => role.title)),
    )
    // Both UKG roles sit under the one UKG heading.
    const underUkg = roles.filter((role) =>
      role.closest('ol').closest('li').querySelector('h3').textContent.startsWith('UKG'),
    )
    expect(underUkg.map((role) => role.textContent)).toEqual([
      'Software Engineer - Business Processes',
      'Solutions Consultant (Team Lead)',
    ])
  })
})
