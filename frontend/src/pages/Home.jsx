import { Link } from 'react-router'
import Journey from '../components/journey/Journey.jsx'
import ProfilePhoto from '../components/ProfilePhoto.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import { buttonStyles } from '../components/ui'
import { profile } from '../content/profile'

export default function Home() {
  return (
    <>
      {/* Photo on top on phones, beside the intro on wider screens. */}
      <section className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent-400">{profile.title}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
          <p className="mt-4 text-lg leading-8 text-zinc-400">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/portfolio" className={buttonStyles.primary}>
              See my portfolio
            </Link>
            <Link to="/projects" className={buttonStyles.secondary}>
              All projects
            </Link>
            <SocialLinks className="ml-1" />
          </div>
        </div>
        <ProfilePhoto src={profile.photo} name={profile.name} className="size-36 md:size-56 lg:size-64" />
      </section>

      <Journey />
    </>
  )
}
