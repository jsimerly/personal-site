import { IconDownload } from '@tabler/icons-react'
import SocialLinks from '../components/SocialLinks.jsx'
import TagList from '../components/TagList.jsx'
import { buttonStyles, sectionLabel } from '../components/ui'
import { profile } from '../content/profile'
import { education, experience, skills } from '../content/resume'
import { formatRange } from '../lib/format'

export default function Resume() {
  return (
    <div className="mx-auto max-w-3xl">
      <title>Resume | Jacob Simerly</title>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{profile.name}</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {profile.title} · {profile.location}
          </p>
        </div>
        {profile.resumePdf && (
          <a href={`${import.meta.env.BASE_URL}${profile.resumePdf}`} className={buttonStyles.secondary}>
            <IconDownload size={16} aria-hidden="true" />
            Download PDF
          </a>
        )}
      </header>
      <SocialLinks className="-ml-2 mt-3" />

      <section className="mt-12">
        <h2 className={sectionLabel}>Experience</h2>
        <ol className="mt-6 space-y-10 border-l border-zinc-200 pl-6 dark:border-zinc-800">
          {experience.map((job) => (
            <li key={`${job.company}-${job.start}`} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-2 left-[-24.5px] size-2.5 -translate-x-1/2 rounded-full bg-accent-500 ring-4 ring-white dark:ring-zinc-950"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-semibold tracking-tight">{job.role}</h3>
                <p className="text-sm text-zinc-500">{formatRange(job.start, job.end)}</p>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                {job.company} · {job.location}
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-zinc-700 marker:text-zinc-400 dark:text-zinc-300">
                {job.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className={sectionLabel}>Skills</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {skills.map(({ group, items }) => (
            <div key={group}>
              <dt className="text-sm font-medium">{group}</dt>
              <dd className="mt-2">
                <TagList tags={items} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14">
        <h2 className={sectionLabel}>Education</h2>
        <ul className="mt-6 space-y-4">
          {education.map((entry) => (
            <li key={entry.school} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-medium">{entry.school}</p>
                <p className="text-zinc-600 dark:text-zinc-400">{entry.degree}</p>
              </div>
              <p className="text-sm text-zinc-500">{entry.year}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
