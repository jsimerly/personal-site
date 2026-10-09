import TopPlayers from '../fantasy/TopPlayers.jsx'

// The Portfolio page: the work I can show off, one tab each, in tab order.
//
// - `slug` names the tab in the URL (/portfolio?tab=<slug>).
// - `project` is its page in the gallery (src/projects); the tab shows that
//   project's summary, description, links, and skills.
// - `Preview` replaces the project's cover with something live.
// - `soon` marks one that isn't ready to show yet. It gets a "Coming soon"
//   tab with just its `summary`. Anything in [brackets] is a placeholder.
export const portfolio = [
  { slug: 'brolympics', name: 'Brolympics', project: 'brolympics' },
  { slug: 'fantasy-football', name: 'Fantasy Football Engineering', project: 'fantasy-analysis', Preview: TopPlayers },
  {
    slug: 'agentic-investing',
    name: 'Agentic Investing',
    soon: true,
    summary: '[Placeholder: a line on what it is and what people will be able to see.]',
  },
  {
    slug: 'ai-control-center',
    name: 'AI Control Center',
    soon: true,
    summary:
      'A hub that listens and dispatches: it runs my routines each morning, lets AI agents respond to what comes in, and alerts me when something needs me.',
  },
]
