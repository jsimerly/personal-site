// The journey, oldest first.
//
// - `side` is 'work' (the formal side: jobs and school) or 'build' (the
//   personal side: projects and learning).
// - `org` (formal side) is the school or company. Where it changes, the new
//   place's name sits quietly above that card, so moves show without shouting.
// - `position` (work) is the job the card is a project from: one of the
//   positions below. Its logo, title, and dates show above its first card.
// - `logos` (optional) are logos shown greyed out above the card, in place of
//   the place's name: paths under public/ like 'logos/ball-state.svg'. Any
//   color logo works, since they're all greyed to one quiet silhouette; a
//   logo with white parts inside (like a cross on a shield) needs its white
//   made see-through first, or it greys into a solid shape.
// - `skills` maps each skill the entry used to how much it grows there. As
//   you scroll past the entry, those skills jump into the basket, and each
//   one grows by its number. A skill's first appearance is where it's picked
//   up. To make a skill grow more at some point, raise its number there; a
//   negative number shrinks it (a skill you stopped using), though it never
//   disappears. Points from work entries tint a skill blue, from builds red.
// - `date` and `end` are 'YYYY-MM', or just 'YYYY' when the month isn't
//   known. `end` is when the entry stopped, or 'now' if it's ongoing; leave
//   it off for one-off projects.
// - `project` is the slug of its page in the gallery (src/projects), and the
//   whole card links there. Every build has one; several entries can share a
//   project (each version of Brolympics).
//
// Entries marked [Placeholder] are made up to fill out the work side for
// now: replace them with the real thing. The growth numbers are a first pass
// to tune.
// Positions I've held. Each shows above the first card from it, with its logo
// beside the title and dates; the cards under it are the projects I did there
// (so they don't repeat the dates).
const anthem = { logos: ['logos/anthem.svg'], title: '[Placeholder] Your role at Anthem', start: '2020' }
const ukgConsultant = {
  logos: ['logos/ukg.svg'],
  title: 'Solutions Consultant (Team Lead)',
  start: '2021-01',
  end: '2022-12',
}
const ukgEngineer = {
  logos: ['logos/ukg.svg'],
  title: 'Software Engineer - Business Processes',
  start: '2023-01',
  end: '2024-07',
}
const barnesThornburg = {
  logos: ['logos/barnes-thornburg.svg'],
  title: 'Data Engineer',
  start: '2024-09',
  end: '2026-03',
}
const lilly = { logos: ['logos/eli-lilly.svg'], title: 'Senior Data Engineer', start: '2026-03', end: 'now' }

// What the basket holds before the first entry, where it all starts. These
// count evenly toward both sides, so they're purple from the start. Every
// other skill joins as the journey goes.
export const startingSkills = { Curious: 3 }

export const journey = [
  {
    date: '2013',
    side: 'build',
    title: 'Teaching myself C++',
    summary: 'My first code: the basics of C++, learned on my own.',
    skills: { 'C++': 1 },
    project: 'cpp',
  },
  {
    date: '2014',
    side: 'build',
    title: 'The first Brolympics',
    summary: "My first app, built in Visual Basic with Visual Studio's drag-and-drop designer. It was rough, but it was a start.",
    skills: { 'Visual Basic': 1 },
    project: 'brolympics',
  },
  {
    date: '2015',
    end: '2020',
    side: 'work',
    logos: ['logos/indiana.svg', 'logos/ball-state.svg', 'logos/sigma-chi-shield.png'],
    title: 'B.S. in Mathematical Economics, minor in Computer Science',
    skills: {},
  },
  {
    date: '2019',
    side: 'build',
    title: 'A Kaggle competition',
    summary: '[Placeholder: which competition, and what you tried.]',
    skills: {},
    project: 'kaggle',
  },
  {
    date: '2020',
    side: 'work',
    position: anthem,
    title: '[Placeholder] A project from Anthem',
    summary: '[Placeholder: what you built or owned there.]',
    skills: {},
  },
  {
    date: '2021-01',
    side: 'work',
    position: ukgConsultant,
    title: 'Customer SaaS implementations',
    summary: 'Ran up to six customer implementations at once, turning what each customer needed into a working setup.',
    skills: { 'Client consulting': 2 },
  },
  {
    date: '2021-01',
    side: 'work',
    position: ukgConsultant,
    title: 'Training new consultants',
    summary: 'Promoted to team lead, responsible for training 60 new consultants and how they did.',
    skills: { 'Team leadership': 2 },
  },
  {
    date: '2021-11',
    side: 'build',
    title: 'The Odin Project',
    summary: "Projects from The Odin Project's web development curriculum.",
    skills: { HTML: 1, CSS: 1, JavaScript: 1 },
    project: 'odin-project',
  },
  {
    date: '2021-12',
    side: 'build',
    title: 'Monty Hall simulation',
    skills: { Python: 1, Jupyter: 1 },
    project: 'monty-hall',
  },
  {
    date: '2021-12',
    side: 'build',
    title: 'KTC analysis and scraping',
    summary: 'Scraping and analyzing KeepTradeCut dynasty fantasy values.',
    skills: { Python: 1, Jupyter: 1, 'Web scraping': 2, 'Data analysis': 1 },
    project: 'ktc-analysis',
  },
  {
    date: '2022-01',
    side: 'build',
    title: 'Dominion',
    summary: 'A Python implementation of the Dominion board game.',
    skills: { Python: 1, 'Object-oriented design': 1 },
    project: 'dominion',
  },
  {
    date: '2022-01',
    side: 'build',
    title: 'Dominion AI',
    skills: { Python: 1, 'Game AI': 2 },
    project: 'dominion-ai',
  },
  {
    date: '2022-04',
    side: 'build',
    title: 'Stuck in High School Sportsbook',
    summary: 'A Django app turning Sleeper projections into betting lines for my fantasy league, deployed on AWS with Docker.',
    skills: { Python: 1, Django: 2, JavaScript: 1, HTML: 1, CSS: 1, AWS: 1, Docker: 1 },
    project: 'sih-sportsbook',
  },
  {
    date: '2023-01',
    side: 'work',
    position: ukgEngineer,
    title: 'Partner onboarding platform',
    summary:
      'Led the design of the process and the product: requirements, relational data schemas, and how the microservices work together.',
    skills: { 'System design': 1, 'Data modeling': 1 },
  },
  {
    date: '2023-01',
    side: 'work',
    position: ukgEngineer,
    title: 'Data pipelines into BigQuery',
    summary: "Automated Python pipelines from Smartsheet's API into our BigQuery warehouse, cleaning the data for analytics.",
    skills: { Python: 2, SQL: 2, BigQuery: 2 },
  },
  {
    date: '2023-03',
    end: '2023-06',
    side: 'build',
    title: 'Brolympics',
    summary: 'The first version: a Django app with a GraphQL API.',
    skills: { Python: 1, Django: 2, GraphQL: 2 },
    project: 'brolympics',
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
    project: 'brolympics',
  },
  {
    date: '2023-08',
    side: 'build',
    title: 'Design patterns',
    skills: { 'Design patterns': 2, 'Object-oriented design': 1 },
    project: 'design-patterns',
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
    project: 'gpt-image-processor',
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
    project: 'rust-engine',
  },
  {
    date: '2024-02',
    side: 'build',
    title: 'Rune',
    summary: 'A game with its own client and server.',
    skills: { Python: 1, Networking: 2 },
    project: 'rune',
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
    project: 'dsa',
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
    date: '2024-09',
    side: 'work',
    position: barnesThornburg,
    title: 'Unified cloud data platform',
    summary:
      "Led the firm's first: moving off on-premises systems onto Microsoft Fabric and Azure, with data from 15+ systems in one lake.",
    skills: {
      'Microsoft Fabric': 3,
      Azure: 2,
      PySpark: 2,
      SQL: 2,
      'Data architecture': 2,
      'Team leadership': 1,
    },
  },
  {
    date: '2024-09',
    side: 'work',
    position: barnesThornburg,
    title: 'Fabric utilities and CI/CD',
    summary:
      'A reusable package and pipelines that standardized ingestion, transformation, and business logic across dev and production.',
    skills: { Python: 2, 'CI/CD': 2 },
  },
  {
    date: '2024-09',
    side: 'work',
    position: barnesThornburg,
    title: 'SharePoint MCP server',
    summary: 'A prototype that lets an LLM work in SharePoint: creating lists, updating columns, editing data, and pulling insights.',
    skills: { MCP: 1 },
  },
  {
    date: '2026-03',
    side: 'work',
    position: lilly,
    title: 'GitHub-native CI/CD for Microsoft Fabric',
    summary:
      "Lilly's first: a workspace per branch, parameterized deployments, and approval gates that brought Fabric under SOX compliance.",
    skills: { 'CI/CD': 3, 'GitHub Actions': 2, 'Microsoft Fabric': 2 },
  },
  {
    date: '2026-03',
    side: 'work',
    position: lilly,
    title: 'Cash Flow Statement platform',
    summary:
      'Re-architected a highly manual quarterly process, with a semantic model that rolls up by day, month, and year and drills to document level.',
    skills: { 'Data modeling': 2, 'Data architecture': 2 },
  },
  {
    date: '2026-03',
    side: 'work',
    position: lilly,
    title: 'Agentic Fabric development',
    summary: 'Brought Claude Code, Fabric Git integration, and VS Code together so developers work locally with context-aware agents.',
    skills: { 'Agentic development': 2 },
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
    project: 'personal-site',
  },
]

// Each skill's running total across `entries`, on top of `startingSkills`, in
// the order it was first picked up: [{ skill, points, work, build }].
// `points` is the net growth (shrinks included); `work` and `build` count only
// growth, by side, and decide the bubble's color.
export function skillTotals(entries) {
  const totals = new Map(
    Object.entries(startingSkills).map(([skill, points]) => [skill, { skill, points, work: points / 2, build: points / 2 }]),
  )
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
