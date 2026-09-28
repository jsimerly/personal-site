import { lazy } from 'react'

// Every project on the site. To add one: build its page under
// src/projects/<slug>/, register it here, and if it needs data, add a matching
// Django app under api/apps/ served at /api/<slug>/. Pages are lazy-loaded so
// each project's code only downloads when someone opens it.
export const projects = [
  {
    slug: 'example',
    name: 'Example project',
    summary: 'A template for new projects. Fetches a list from the API and renders it.',
    Page: lazy(() => import('./example/ExamplePage.jsx')),
  },
]
