import ProfilePhoto from '../components/ProfilePhoto.jsx'
import { about } from '../content/about'
import { profile } from '../content/profile'

// A little about me, the person rather than the resume (content/about.js):
// a short intro, a list of quick facts, and candid photos. Photo on top on
// phones, beside the words on wider screens; the facts go to two columns
// where there's room.
export default function About() {
  return (
    <div>
      <title>About | Jacob Simerly</title>
      <div className="flex flex-col-reverse gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About me</h1>
          <div className="mt-6 space-y-5 text-lg leading-8 text-zinc-300">
            {about.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <ProfilePhoto src={profile.photo} name={profile.name} className="size-36 md:size-64" />
      </div>

      <dl className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {about.facts.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">{label}</dt>
            <dd className="mt-1 leading-7 text-zinc-300">{value}</dd>
          </div>
        ))}
      </dl>

      {about.photos.length > 0 && (
        <ul aria-label="Photos" className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {about.photos.map(({ file, alt }) => (
            <li key={file}>
              <img
                src={`${import.meta.env.BASE_URL}${file}`}
                alt={alt}
                loading="lazy"
                className="aspect-square w-full rounded-xl bg-zinc-900 object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
