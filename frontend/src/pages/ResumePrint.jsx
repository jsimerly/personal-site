import { profile } from '../content/profile'
import { education, experience, personalProjects, skills } from '../content/resume'
import { formatRange } from '../lib/format'

// The resume laid out for paper: what scripts/build-resume-pdf.mjs prints to
// the PDF the Resume page offers. Light, one column, Letter-sized margins,
// every link written out (paper has nothing to click), and nothing from the
// site around it. It reads the same content as the Resume page, so the PDF
// can never drift from it, and never carries anything the page doesn't.
//
// The zinc shades are the site's dark-theme overrides (index.css), so on
// white the mid greys are the muted text and zinc-900 is the ink.

const SITE = 'jacob-simerly.com'
const bare = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

export default function ResumePrint() {
  const current = experience[0].roles[0]
  const { github, linkedin, email } = profile.links
  const contact = [email, linkedin && bare(linkedin), github && bare(github), SITE].filter(Boolean)

  return (
    <main className="mx-auto min-h-screen max-w-[7.5in] bg-white px-[0.25in] py-[0.35in] text-[10.5pt] leading-[1.4] text-zinc-900 print:px-0 print:py-0">
      <title>{`${profile.name} - Resume`}</title>
      <header>
        <h1 className="text-[22pt] font-semibold tracking-tight">{profile.name}</h1>
        <p className="mt-0.5 text-[11.5pt] text-zinc-700">
          {current.title} · {profile.location}
        </p>
        <p className="mt-1 text-[9.5pt] text-zinc-700">{contact.join('  ·  ')}</p>
      </header>

      <section className="mt-5">
        <h2 className="border-b border-zinc-900 pb-1 text-[9pt] font-semibold tracking-[0.18em] uppercase">Experience</h2>
        {experience.map((job) => (
          <div key={job.company} className="mt-3">
            <h3 className="text-[11pt] font-semibold">
              {job.company}
              {job.note && <span className="font-normal text-zinc-700"> ({job.note})</span>}
            </h3>
            {job.roles.map((role) => (
              <div key={role.title} className="mt-1.5 break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="italic">{role.title}</h4>
                  <p className="shrink-0 text-[9.5pt] text-zinc-700">{formatRange(role.start, role.end)}</p>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 marker:text-zinc-700">
                  {role.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="mt-5 break-inside-avoid">
        <h2 className="border-b border-zinc-900 pb-1 text-[9pt] font-semibold tracking-[0.18em] uppercase">Skills</h2>
        <dl className="mt-2 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
          {skills.map((group) => (
            <div key={group.group} className="contents">
              <dt className="font-semibold">{group.group}</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-5 break-inside-avoid">
        <h2 className="border-b border-zinc-900 pb-1 text-[9pt] font-semibold tracking-[0.18em] uppercase">Education</h2>
        {education.map((school) => (
          <div key={school.school} className="mt-2 flex items-baseline justify-between gap-4">
            <div>
              <h3 className="font-semibold">{school.school}</h3>
              <p>
                {school.degree}, {school.minor}
              </p>
            </div>
            <p className="shrink-0 text-right text-[9.5pt] text-zinc-700">
              {school.location}
              <br />
              {formatRange(school.start, school.end)}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-5">
        <h2 className="border-b border-zinc-900 pb-1 text-[9pt] font-semibold tracking-[0.18em] uppercase">Personal projects</h2>
        {personalProjects.map((project) => (
          <div key={project.name} className="mt-2 break-inside-avoid">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="shrink-0 text-[9.5pt] text-zinc-700">{project.links.map(({ href }) => bare(href)).join('  ·  ')}</p>
            </div>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 marker:text-zinc-700">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  )
}
