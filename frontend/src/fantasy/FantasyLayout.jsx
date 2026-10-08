import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router'

// The fantasy analysis section (/fantasy-analysis/...): its own heading and
// tabs, one route per view, so new views slot in as new tabs.
const VIEWS = [
  { to: '/fantasy-analysis', label: 'Player values', end: true },
  { to: '/fantasy-analysis/model', label: 'Model performance' },
]

export default function FantasyLayout() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Fantasy Analysis</h1>
      <p className="mt-3 max-w-3xl text-lg text-zinc-400">
        My own projection models for dynasty fantasy football. Every NFL player is valued in wins above replacement
        for my leagues, and the market is measured against those values.
      </p>
      <nav aria-label="Fantasy analysis" className="mt-8 flex gap-6 overflow-x-auto border-b border-zinc-800">
        {VIEWS.map((view) => (
          <NavLink
            key={view.to}
            to={view.to}
            end={view.end}
            className="-mb-px shrink-0 border-b-2 border-transparent pb-3 text-sm font-medium whitespace-nowrap text-zinc-400 transition-colors hover:text-zinc-200 aria-[current=page]:border-zinc-100 aria-[current=page]:text-zinc-50"
          >
            {view.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8">
        {/* Each view loads on first visit; the heading and tabs stay put meanwhile. */}
        <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
          <Outlet />
        </Suspense>
      </div>
    </>
  )
}
