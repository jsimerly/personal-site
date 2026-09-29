// The Portfolio page: the work I can show off, one tab each, in tab order.
//
// - `slug` names the tab in the URL (/portfolio?tab=<slug>).
// - `project` is its page in the gallery (src/projects); the tab shows that
//   project's summary, description, links, and skills.
// - `soon` marks one that isn't ready to show yet. It gets a "Coming soon"
//   tab with just its `summary`. Anything in [brackets] is a placeholder.
export const portfolio = [
  { slug: 'brolympics', name: 'Brolympics', project: 'brolympics' },
  {
    slug: 'fantasy-football',
    name: 'Fantasy Football Engineering',
    soon: true,
    summary: '[Placeholder: a line on what it is and what people will be able to see.]',
  },
  {
    slug: 'agentic-investing',
    name: 'Agentic Investing',
    soon: true,
    summary: '[Placeholder: a line on what it is and what people will be able to see.]',
  },
]
