import { render, screen } from '@testing-library/react'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
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

  it('never points the download at a PDF missing from public/, so the build ships it', () => {
    // Tests run from frontend/, where Vite serves public/ at the site root.
    const missing = [profile.resumePdf].filter(Boolean).filter((pdf) => !existsSync(resolve('public', pdf)))

    expect(missing).toEqual([])
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
