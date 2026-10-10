// Who I am, in one place. Anything in [brackets] is a placeholder to fill in.
export const profile = {
  name: 'Jacob Simerly',
  // The home page's first screen has to say, within ten seconds, what I do,
  // for whom, and the proof. Fabric clients first, hiring managers second.
  // The line above my name: the work, in the words people search for.
  title: 'Microsoft Fabric · Data engineering · AI',
  // The first sentence anyone reads: what I do, plainly.
  headline: 'I build Microsoft Fabric data platforms that hold up to audit, and lead the teams that run them.',
  // The proof right under it: where, and what I did there.
  intro:
    "Now at Eli Lilly, where I launched its first SOX-compliant CI/CD for Fabric. Before that, I led Barnes & Thornburg's move from on-premises systems to one cloud data platform.",
  // Where I've built, as a quiet row of greyed logos under the intro. Paths
  // under public/. Each has its own height, set by eye, so a two-line
  // wordmark and a heavy one read about the same size.
  builtAt: [
    { name: 'Eli Lilly', logo: 'logos/eli-lilly.svg', height: 'h-8' },
    { name: 'Barnes & Thornburg', logo: 'logos/barnes-thornburg.svg', height: 'h-9' },
    { name: 'UKG', logo: 'logos/ukg.svg', height: 'h-5' },
    { name: 'Anthem', logo: 'logos/anthem.svg', height: 'h-6' },
  ],
  // "Work with me": the field's prompt, what happens after, and the thanks.
  contact: {
    prompt: 'Your email or phone',
    promise: "I'll get back to you within a day.",
    thanks: "Got it. I'll get back to you within a day.",
  },
  location: 'Indianapolis, IN',
  links: {
    github: 'https://github.com/jsimerly',
    linkedin: null,
    email: null,
  },
  // Paths under public/ once the files are there, e.g. 'jacob.jpg' and
  // 'jacob-simerly-resume.pdf'. The photo shows square, cropped to a circle.
  photo: 'jacob.jpg',
  // The PDF the Resume page offers. It isn't a file I keep: the build prints
  // it from the resume content above (scripts/build-resume-pdf.mjs), so it
  // always matches the page and never carries anything the page doesn't.
  resumePdf: 'jacob-simerly-resume.pdf',
  // The pitch at the end of the journey, under "Want to build something together?"
  nextUp:
    "I'm always building something, and it's more fun with other people. [A line on what you'd love to dig into next.]",
}
