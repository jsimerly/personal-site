import { Suspense, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { profile } from '../content/profile'
import { useApi } from '../hooks/useApi'
import SocialLinks from './SocialLinks.jsx'

const navLink =
  'rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 aria-[current=page]:font-medium aria-[current=page]:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 dark:aria-[current=page]:text-zinc-100'

export default function Layout() {
  const { pathname } = useLocation()
  // A new page starts at the top, not wherever the last one was scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  // A quiet ping on load, so the Cloud Run API starts waking before anyone
  // opens a project that needs it.
  useApi('/api/health/')

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="font-semibold tracking-tight">
            {profile.name}
          </Link>
          <nav aria-label="Main">
            <ul className="flex items-center">
              <li>
                <NavLink to="/portfolio" className={navLink}>
                  Portfolio
                </NavLink>
              </li>
              <li>
                <NavLink to="/projects" className={navLink}>
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/resume" className={navLink}>
                  Resume
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navLink}>
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-16">
        <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-900">
        <div className="mx-auto flex h-(--footer-height) max-w-6xl items-center justify-between px-4 text-xs text-zinc-600">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <SocialLinks size={16} className="-mr-2" />
        </div>
      </footer>
    </div>
  )
}
