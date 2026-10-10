// A Vite plugin for the dev server only. The resume PDF is printed by the
// build (build-resume-pdf.mjs), so in dev it only exists once someone has
// printed a copy into public/. Without this, a request for a missing PDF
// gets the app's HTML instead (Vite's single-page fallback), and the browser
// saves a web page under a .pdf name that then "fails to open". Now it gets
// a 404 that says what to run.
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

// `handle` answers one request: true when it was the missing PDF and a hint
// was sent, false to let Vite carry on.
export function missingPdfHint(pdf, isPresent) {
  const route = `/${pdf}`
  const hint = `No ${pdf} yet. Print one from this dev server:\n\n  npm run resume:pdf -- public http://localhost:5173\n`
  return (req, res) => {
    if (req.url?.split('?')[0] !== route || isPresent()) return false
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end(hint)
    return true
  }
}

export default function resumePdfHint(pdf) {
  return {
    name: 'resume-pdf-hint',
    apply: 'serve',
    configureServer(server) {
      const handle = missingPdfHint(pdf, () => existsSync(resolve(server.config.publicDir, pdf)))
      server.middlewares.use((req, res, next) => {
        if (!handle(req, res)) next()
      })
    },
  }
}
