import { IconBrandLinkedin, IconMail } from '@tabler/icons-react'
import { Link } from 'react-router'
import { profile } from '../../content/profile'
import { buttonStyles } from '../ui'

// Where the journey's line ends: an open ring for what hasn't happened yet,
// and the invitation to be part of it.
export default function WhatsNext() {
  const { email, linkedin } = profile.links

  return (
    <section aria-labelledby="whats-next-title" className="flex flex-col items-center text-center">
      {/* The dashed line keeps going from "Today" into this ring. */}
      <span aria-hidden="true" className="hidden h-16 border-l-2 border-dashed border-zinc-700 lg:block" />
      <span aria-hidden="true" className="mt-12 size-4 rounded-full border-2 border-both shadow-[0_0_8px_var(--color-both)] lg:mt-0" />
      <p className="mt-4 text-xs font-semibold tracking-widest text-both uppercase">What&apos;s next</p>
      <h2 id="whats-next-title" className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        Want to be a part of what&apos;s next?
      </h2>
      <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-400">{profile.nextUp}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {email ? (
          <a href={`mailto:${email}`} className={buttonStyles.primary}>
            <IconMail size={16} aria-hidden="true" />
            Email me
          </a>
        ) : (
          <span className={`${buttonStyles.primary} cursor-default opacity-60`}>[Add your email in profile.js]</span>
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
    </section>
  )
}
