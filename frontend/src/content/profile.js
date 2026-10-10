// Who I am, in one place. Anything in [brackets] is a placeholder to fill in.
export const profile = {
  name: 'Jacob Simerly',
  // The line above my name on the home page: who I am, not a job title (the
  // resume has those).
  title: 'Builder and technology leader',
  location: 'Indianapolis, IN',
  intro:
    "I've been building things since before I knew how to code, and I haven't stopped. Now I help teams build too, setting the architecture, standards, and direction for software, data, and AI that take real work off people's plates.",
  links: {
    github: 'https://github.com/jsimerly',
    linkedin: null,
    email: null,
  },
  // Paths under public/ once the files are there, e.g. 'jacob.jpg' and
  // 'jacob-simerly-resume.pdf'. The photo shows square, cropped to a circle.
  photo: null,
  // The PDF the Resume page offers. It isn't a file I keep: the build prints
  // it from the resume content above (scripts/build-resume-pdf.mjs), so it
  // always matches the page and never carries anything the page doesn't.
  resumePdf: 'jacob-simerly-resume.pdf',
  // The pitch at the end of the journey, under "Want to build something together?"
  nextUp:
    "I'm always building something, and it's more fun with other people. [A line on what you'd love to dig into next.]",
}
