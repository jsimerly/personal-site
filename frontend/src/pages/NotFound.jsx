import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        <Link to="/" className="underline underline-offset-4">
          Back to the home page
        </Link>
      </p>
    </section>
  )
}
