// The journey, oldest first.
//
// - `side` is 'work' (the formal side: jobs and school) or 'build' (the
//   personal side: projects and learning).
// - `org` (formal side) is the school or company. Consecutive entries at the
//   same place share one faint rail down the margin, which runs until that
//   place's `end` or the next place starts, so changes show without shouting.
// - `tag` overrides the card's label ('Work' or 'Build' by default).
// - `skills` maps each skill the entry used to how much it grows there. As
//   you scroll past the entry, those skills jump into the basket, and each
//   one grows by its number. A skill's first appearance is where it's picked
//   up. To make a skill grow more at some point, raise its number there; a
//   negative number shrinks it (a skill you stopped using), though it never
//   disappears. Points from work entries tint a skill blue, from builds red.
// - `end` is when the entry stopped ('YYYY-MM', or 'now' if it's ongoing).
//   Leave it off for one-off projects.
// - `project` links to a gallery page; `href` links anywhere else.
//
// Entries marked [Placeholder] are made up to fill out the work side for
// now: replace them with the real thing. The growth numbers are a first pass
// to tune.
const repo = (name) => `https://github.com/jsimerly/${name}`

export const journey = [
  {
    date: '2020-05',
    side: 'work',
    end: '2022-05',
    tag: 'School',
    org: '[University]',
    title: '[Placeholder] B.S. in [Major], [University]',
    summary: '[Placeholder: where you studied and what you focused on.]',
    skills: { Statistics: 2, Java: 1, 'Data structures': 1 },
  },
  {
    date: '2021-11',
    side: 'build',
    title: 'The Odin Project',
    summary: "Projects from The Odin Project's web development curriculum.",
    skills: { HTML: 1, CSS: 1, JavaScript: 1 },
    href: repo('OdinRepo'),
  },
  {
    date: '2021-12',
    side: 'build',
    title: 'Monty Hall simulation',
    skills: { Python: 1, Jupyter: 1 },
    href: repo('Monty-Hall-Python'),
  },
  {
    date: '2021-12',
    side: 'build',
    title: 'KTC analysis and scraping',
    summary: 'Scraping and analyzing KeepTradeCut dynasty fantasy values.',
    skills: { Python: 1, Jupyter: 1, 'Web scraping': 2, 'Data analysis': 1 },
    href: repo('KTC-Analysis-and-Scraping'),
  },
  {
    date: '2022-01',
    side: 'build',
    title: 'Dominion',
    summary: 'A Python implementation of the Dominion board game.',
    skills: { Python: 1, 'Object-oriented design': 1 },
    href: repo('dominion'),
  },
  {
    date: '2022-01',
    side: 'build',
    title: 'Dominion AI',
    skills: { Python: 1, 'Game AI': 2 },
    href: repo('DominionAI'),
  },
  {
    date: '2022-06',
    end: '2024-10',
    side: 'work',
    org: '[Company A]',
    title: '[Placeholder] Data Analyst at [Company A]',
    summary: '[Placeholder: what you owned there and what changed because of it.]',
    skills: { SQL: 3, Python: 2, Excel: 2, Tableau: 2, 'Data analysis': 2, Statistics: 1 },
  },
  {
    date: '2023-03',
    end: '2023-06',
    side: 'build',
    title: 'Brolympics',
    summary: 'The first version: a Django app with a GraphQL API.',
    skills: { Python: 1, Django: 2, GraphQL: 2 },
    href: repo('Brolympics'),
  },
  {
    date: '2023-06',
    end: '2024-09',
    side: 'build',
    title: 'Brolympics V2',
    summary: 'Rebuilt on Django REST Framework instead of Graphene.',
    skills: {
      Python: 1,
      Django: 1,
      'Django REST Framework': 2,
      React: 2,
      JavaScript: 1,
      'Tailwind CSS': 1,
      CSS: 1,
      GraphQL: -1,
    },
    href: repo('Brolympics_V2'),
  },
  {
    date: '2023-08',
    side: 'build',
    title: 'Design patterns',
    skills: { 'Design patterns': 2, 'Object-oriented design': 1 },
    href: repo('design-patterns'),
  },
  {
    date: '2023-08',
    end: 'now',
    side: 'build',
    title: 'Fantasy Analysis',
    summary: 'Data pipelines, projections, and analysis for my dynasty fantasy football league.',
    skills: { Python: 2, Jupyter: 1, 'Data analysis': 2, Polars: 2, 'Cloud Storage': 1 },
    project: 'fantasy-analysis',
  },
  {
    date: '2023-12',
    side: 'build',
    title: 'GPT image processor',
    skills: { Python: 1, 'LLM APIs': 2 },
    href: repo('gpt-image-processor'),
  },
  {
    date: '2024-02',
    side: 'build',
    title: 'ECS Engine',
    summary: 'A lightweight, dependency-free Entity Component System for Python games.',
    skills: { Python: 1, 'Entity Component Systems': 2, 'Object-oriented design': 1 },
    project: 'ecs-engine',
  },
  {
    date: '2024-02',
    side: 'build',
    title: 'Rust engine',
    skills: { Rust: 2, 'Entity Component Systems': 1 },
  },
  {
    date: '2024-02',
    side: 'build',
    title: 'Rune',
    summary: 'A game with its own client and server.',
    skills: { Python: 1, Networking: 2 },
    href: repo('Rune_Server'),
  },
  {
    date: '2024-04',
    side: 'build',
    title: 'AnkiCode',
    summary: 'An Anki-style spaced repetition system for keeping LeetCode practice fresh.',
    skills: { Python: 1, Algorithms: 1 },
    project: 'ankicode',
  },
  {
    date: '2024-05',
    side: 'build',
    title: 'Data structures and algorithms',
    skills: { Python: 1, Jupyter: 1, Algorithms: 2 },
    href: repo('dsa'),
  },
  {
    date: '2024-09',
    end: 'now',
    side: 'build',
    title: 'Brolympics, in production',
    summary: 'Split into its own API and frontend, running real game days on Cloud Run.',
    skills: {
      Python: 2,
      Django: 2,
      'Django REST Framework': 3,
      React: 3,
      JavaScript: 2,
      'Tailwind CSS': 2,
      'Cloud Run': 2,
      Postgres: 2,
      'Firebase Auth': 1,
      Docker: 1,
      pytest: 2,
      Playwright: 2,
    },
    project: 'brolympics',
  },
  {
    date: '2024-10',
    end: 'now',
    side: 'work',
    org: '[Company B]',
    title: '[Placeholder] Software Engineer at [Company B]',
    summary: '[Placeholder: what you build there and for whom.]',
    skills: {
      Python: 3,
      TypeScript: 2,
      React: 2,
      AWS: 2,
      Docker: 1,
      Postgres: 1,
      SQL: 1,
      Excel: -2,
      Tableau: -2,
    },
  },
  {
    date: '2025-08',
    side: 'work',
    org: '[Company B]',
    title: '[Placeholder] Led [a big project] at [Company B]',
    summary: '[Placeholder: a promotion or milestone worth its own dot.]',
    skills: { 'System design': 3, AWS: 2, TypeScript: 1, Kubernetes: 2 },
  },
  {
    date: '2026-09',
    end: 'now',
    side: 'build',
    title: 'This site',
    summary: 'A static React site on GitHub Pages, reading a Django API on Cloud Run.',
    skills: {
      React: 1,
      JavaScript: 1,
      Vite: 1,
      'Tailwind CSS': 1,
      Python: 1,
      'Django REST Framework': 1,
      'GitHub Actions': 1,
      Playwright: 1,
    },
    href: repo('personal-site'),
  },
]

// Each skill's running total across `entries`, in the order it was first
// picked up: [{ skill, points, work, build }]. `points` is the net growth
// (shrinks included); `work` and `build` count only growth, by side, and
// decide the bubble's color.
export function skillTotals(entries) {
  const totals = new Map()
  for (const entry of entries) {
    for (const [skill, points] of Object.entries(entry.skills)) {
      const total = totals.get(skill) ?? { skill, points: 0, work: 0, build: 0 }
      total.points += points
      if (points > 0) total[entry.side] += points
      totals.set(skill, total)
    }
  }
  return [...totals.values()]
}
