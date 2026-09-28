import { Suspense } from 'react'
import { Link, Outlet } from 'react-router'
import ApiStatus from './ApiStatus.jsx'

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-semibold tracking-tight">
            Jacob Simerly
          </Link>
          <a
            href="https://github.com/jsimerly"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-16">
        <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-6 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} Jacob Simerly</span>
          <ApiStatus />
        </div>
      </footer>
    </div>
  )
}
