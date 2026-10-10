import { describe, expect, it, vi } from 'vitest'
import { missingPdfHint } from './resume-pdf-hint.mjs'

function request(url) {
  const res = { statusCode: 200, headers: {}, body: null, setHeader: (k, v) => (res.headers[k] = v), end: (b) => (res.body = b) }
  return { req: { url }, res }
}

describe('missingPdfHint', () => {
  it('answers a request for the PDF that has not been printed yet with a plain 404 saying how to print it', () => {
    const handle = missingPdfHint('jacob-simerly-resume.pdf', () => false)
    const { req, res } = request('/jacob-simerly-resume.pdf?download')

    expect(handle(req, res)).toBe(true)
    expect(res.statusCode).toBe(404)
    expect(res.headers['Content-Type']).toBe('text/plain; charset=utf-8')
    expect(res.body).toBe(
      'No jacob-simerly-resume.pdf yet. Print one from this dev server:\n\n  npm run resume:pdf -- public http://localhost:5173\n',
    )
  })

  it('stays out of the way once the PDF exists, and for every other path', () => {
    const present = vi.fn(() => true)
    const { req, res } = request('/jacob-simerly-resume.pdf')

    expect(missingPdfHint('jacob-simerly-resume.pdf', present)(req, res)).toBe(false)
    expect(missingPdfHint('jacob-simerly-resume.pdf', () => false)({ url: '/resume' }, res)).toBe(false)
    expect(res.statusCode).toBe(200)
  })
})
