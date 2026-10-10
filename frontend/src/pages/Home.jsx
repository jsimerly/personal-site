import { IconFileText } from '@tabler/icons-react'
import { Link } from 'react-router'
import ContactCapture from '../components/ContactCapture.jsx'
import Journey from '../components/journey/Journey.jsx'
import ProfilePhoto from '../components/ProfilePhoto.jsx'
import SelectedWork from '../components/SelectedWork.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import { buttonStyles } from '../components/ui'
import { profile } from '../content/profile'

// The first screen answers, before any scrolling: what I do, for whom, the
// proof, and how to reach me. The proof follows right under it (Selected
// work), and the journey tells the longer story below that.
export default function Home() {
  return (
    <>
      {/* Photo on top on phones (small, so the words still fit the first
          screen), beside the intro on wider screens. */}
      <section className="flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent-400">{profile.title}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
          <p className="mt-5 text-xl leading-8 text-zinc-100 sm:text-2xl sm:leading-9">{profile.headline}</p>
          <p className="mt-4 text-lg leading-8 text-zinc-400">{profile.intro}</p>
          {/* Top-aligned, so the buttons stay level with the field when it
              opens with its note underneath. */}
          <div className="mt-8 flex flex-wrap items-start gap-3">
            <ContactCapture source="hero" />
            <Link to="/resume" className={buttonStyles.secondary}>
              <IconFileText size={16} aria-hidden="true" />
              Resume
            </Link>
            <SocialLinks className="ml-1" />
          </div>
          <div className="mt-10">
            <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Where I&apos;ve built</p>
            <ul className="mt-3 flex flex-wrap items-center gap-x-9 gap-y-4">
              {profile.builtAt.map((place) => (
                <li key={place.name}>
                  <img
                    src={`${import.meta.env.BASE_URL}${place.logo}`}
                    alt={place.name}
                    className={`${place.height} w-auto opacity-50 brightness-0 invert`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ProfilePhoto src={profile.photo} name={profile.name} className="size-24 md:size-56 lg:size-64" />
      </section>

      <SelectedWork />

      <Journey />
    </>
  )
}
