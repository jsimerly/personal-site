import { Link } from 'react-router'
import Journey from '../components/journey/Journey.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import { buttonStyles } from '../components/ui'
import { profile } from '../content/profile'

export default function Home() {
  return (
    <>
      <section className="max-w-2xl">
        <p className="text-sm font-medium text-accent-400">{profile.title}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-400">{profile.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/projects" className={buttonStyles.primary}>
            See my work
          </Link>
          <Link to="/resume" className={buttonStyles.secondary}>
            Resume
          </Link>
          <SocialLinks className="ml-1" />
        </div>
      </section>

      <Journey />
    </>
  )
}
