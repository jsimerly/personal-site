import { IconBrandLinkedin, IconMail } from '@tabler/icons-react'
import { Link } from 'react-router'
import { profile } from '../../content/profile'
import { buttonStyles, newTab } from '../ui'

// Where the journey's line ends, and the page's centerpiece: the last screen
// of the page, the dashed line running down into an open ring for what hasn't
// happened yet, and an open invite to build something together. The section
// plus the footer fill exactly one screen, so when the scroll bottoms out,
// the invite sits in the middle of it.
const primary =
  'inline-flex items-center justify-center gap-2 rounded-full bg-both px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-both'

export default function WhatsNext() {
  const { email, linkedin } = profile.links

  return (
    <>
      {/* The line keeps going past the projects, long enough that they scroll
          away before what's next arrives. */}
      <span aria-hidden="true" className="mx-auto hidden h-[35vh] w-0 border-l-2 border-dashed border-zinc-700 lg:block" />

      <section
        id="contact"
        aria-labelledby="whats-next-title"
        className="-mb-10 flex min-h-[calc(100dvh-3.5rem-var(--footer-height))] flex-col items-center text-center sm:-mb-16"
      >
        {/* The line runs on down the upper half of the screen into the ring;
            the spacer below balances it, so the invitation sits centered. */}
        <span aria-hidden="true" className="hidden min-h-8 w-0 flex-1 border-l-2 border-dashed border-zinc-700 lg:block" />
        <span aria-hidden="true" className="flex-1 lg:hidden" />

        <span
          aria-hidden="true"
          className="size-5 rounded-full border-2 border-both"
        />
        <p className="mt-5 text-xs font-semibold tracking-widest text-both uppercase">What&apos;s next</p>
        <h2
          id="whats-next-title"
          className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl"
        >
          Want to build something together?
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">{profile.nextUp}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {email ? (
            <a href={`mailto:${email}`} className={primary}>
              <IconMail size={18} aria-hidden="true" />
              Email me
            </a>
          ) : (
            <span className={`${primary} cursor-default`}>[Add your email in profile.js]</span>
          )}
          {linkedin && (
            <a href={linkedin} {...newTab} className={buttonStyles.secondary}>
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
