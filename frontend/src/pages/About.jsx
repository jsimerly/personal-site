import ProfilePhoto from '../components/ProfilePhoto.jsx'
import { about } from '../content/about'
import { profile } from '../content/profile'

// A little about me, the person rather than the resume (content/about.js).
// Photo on top on phones, beside the words on wider screens.
export default function About() {
  return (
    <div className="flex flex-col-reverse gap-10 md:flex-row md:items-start md:justify-between">
      <title>About | Jacob Simerly</title>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About me</h1>
        <div className="mt-6 space-y-5 text-lg leading-8 text-zinc-300">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <ProfilePhoto src={profile.photo} name={profile.name} className="size-36 md:size-64" />
    </div>
  )
}
