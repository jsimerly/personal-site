import { IconBrandLinkedin, IconMail } from '@tabler/icons-react'
import { Link } from 'react-router'
import { profile } from '../../content/profile'
import { buttonStyles } from '../ui'

// Where the journey's line ends, and the page's centerpiece: the last screen
// of the page, the dashed line running down into an open ring for what hasn't
// happened yet, and the invitation to be part of it. The section plus the
// footer fill exactly one screen, so when the scroll bottoms out, the
// invitation sits in the middle of it.
const primary =
  'inline-flex items-center justify-center gap-2 rounded-full bg-both px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_28px_color-mix(in_oklab,var(--color-both)_45%,transparent)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-both'

export default function WhatsNext() {
  const { email, linkedin } = profile.links

  return (
    <>
      {/* The line keeps going past the projects, long enough that they scroll
          away before what's next arrives. */}
      <span aria-hidden="true" className="mx-auto hidden h-[35vh] w-0 border-l-2 border-dashed border-zinc-700 lg:block" />

      <section
        aria-labelledby="whats-next-title"
        className="relative -mb-10 flex min-h-[calc(100dvh-3.5rem-var(--footer-height))] flex-col items-center text-center sm:-mb-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-both)_12%,transparent),transparent_60%)]"
        />
        {/* The line runs on down the upper half of the screen into the ring;
            the spacer below balances it, so the invitation sits centered. */}
        <span aria-hidden="true" className="hidden min-h-8 w-0 flex-1 border-l-2 border-dashed border-zinc-700 lg:block" />
        <span aria-hidden="true" className="flex-1 lg:hidden" />

        <span
          aria-hidden="true"
          className="relative size-5 rounded-full border-2 border-both shadow-[0_0_12px_var(--color-both)]"
        />
        <p className="relative mt-5 text-xs font-semibold tracking-widest text-both uppercase">What&apos;s next</p>
        <h2
          id="whats-next-title"
          className="relative mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl"
        >
          Want to be a part of what&apos;s next?
        </h2>
        <p className="relative mt-5 max-w-xl text-lg leading-8 text-zinc-400">{profile.nextUp}</p>
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
          {email ? (
            <a href={`mailto:${email}`} className={primary}>
              <IconMail size={18} aria-hidden="true" />
              Email me
            </a>
          ) : (
            <span className={`${primary} cursor-default opacity-60`}>[Add your email in profile.js]</span>
          )}
          {linkedin && (
            <a href={linkedin} className={buttonStyles.secondary}>
              <IconBrandLinkedin size={16} aria-hidden="true" />
              LinkedIn
            </a>
          )}
          <Link to="/projects" className={buttonStyles.secondary}>
            See my projects
          </Link>
        </div>

        <span aria-hidden="true" className="flex-1" />
      </section>
    </>
  )
}
