import { IconDownload } from '@tabler/icons-react'
import SocialLinks from '../components/SocialLinks.jsx'
import TagList from '../components/TagList.jsx'
import { buttonStyles, newTab, sectionLabel, textLink } from '../components/ui'
import { profile } from '../content/profile'
import { education, experience, personalProjects, skills } from '../content/resume'
import { formatRange } from '../lib/format'

const bullets = 'mt-3 list-disc space-y-1.5 pl-5 text-zinc-700 marker:text-zinc-500 dark:text-zinc-300'

// The resume as a page, in the PDF's order, with the PDF itself one click
// away. The line under my name is my current role, so it never goes stale.
export default function Resume() {
  const current = experience[0].roles[0]

  return (
    <div className="mx-auto max-w-3xl">
      <title>Resume | Jacob Simerly</title>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{profile.name}</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {current.title} · {profile.location}
          </p>
        </div>
        {profile.resumePdf && (
          <a
            href={`${import.meta.env.BASE_URL}${profile.resumePdf}`}
            download={`${profile.name} - Resume.pdf`}
            className={`${buttonStyles.primary} self-start sm:self-auto`}
          >
            <IconDownload size={16} aria-hidden="true" />
            Download resume
          </a>
        )}
      </header>
      <SocialLinks className="mt-3 -ml-2" />

      <section className="mt-12">
        <h2 className={sectionLabel}>Experience</h2>
        <ol className="mt-6 space-y-10 border-l border-zinc-200 pl-6 dark:border-zinc-800">
          {experience.map((job) => (
            <li key={job.company} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-2 left-[-24.5px] size-2.5 -translate-x-1/2 rounded-full bg-accent-500 ring-4 ring-white dark:ring-zinc-950"
              />
              <h3 className="font-semibold tracking-tight">
                {job.company}
                {job.note && <span className="font-normal text-zinc-500"> ({job.note})</span>}
              </h3>
              <ol className="mt-3 space-y-6">
                {job.roles.map((role) => (
                  <li key={role.title}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h4 className="text-zinc-700 italic dark:text-zinc-200">{role.title}</h4>
                      <p className="shrink-0 text-sm text-zinc-500">{formatRange(role.start, role.end)}</p>
                    </div>
                    <ul className={bullets}>
                      {role.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
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
            <li key={entry.school}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="font-medium">{entry.school}</p>
                <p className="text-sm text-zinc-500">{entry.location}</p>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="text-zinc-600 dark:text-zinc-400">{entry.degree}</p>
                <p className="text-sm text-zinc-500">{formatRange(entry.start, entry.end)}</p>
              </div>
              {entry.minor && <p className="text-zinc-600 dark:text-zinc-400">{entry.minor}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className={sectionLabel}>Personal projects</h2>
        <ul className="mt-6 space-y-8">
          {personalProjects.map((project) => (
            <li key={project.name}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-semibold tracking-tight">{project.name}</h3>
                <p className="flex shrink-0 gap-3 text-sm">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} {...newTab} className={textLink}>
                      {link.label}
                    </a>
                  ))}
                </p>
              </div>
              <ul className={bullets}>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
