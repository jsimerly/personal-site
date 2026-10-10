// The journey. The timeline shows it oldest first, sorted by `date` (see
// `journey` below), so entries can be written in whatever order reads best.
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
// The work side is a first pass from the resume: entries that go past what
// it says carry a TODO(jacob) to check. The growth numbers are a first pass
// to tune.
// Positions I've held. Each shows above the first card from it, with its logo
// beside the title and dates; the cards under it are the projects I did there
// (so they don't repeat the dates).
// TODO(jacob): the internship's team and months.
const anthemIntern = { logos: ['logos/anthem.svg'], title: 'Intern', start: '2019' }
const anthem = { logos: ['logos/anthem.svg'], title: 'Process Consulting', start: '2020' }
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
  title: 'Lead Data Engineer',
  start: '2024-09',
  end: '2026-03',
}
const lilly = { logos: ['logos/eli-lilly.svg'], title: 'Senior Data Engineer', start: '2026-03', end: 'now' }

// What the basket holds before the first entry, where it all starts. These
// count evenly toward both sides, so they're purple from the start. Every
// other skill joins as the journey goes.
export const startingSkills = { Curious: 3 }

const entries = [
  {
    date: '2013',
    side: 'build',
    title: 'Teaching Myself C++',
    summary: 'My first code: the basics of C++, learned on my own.',
    skills: { 'C++': 1 },
    project: 'cpp',
  },
  {
    date: '2014',
    side: 'build',
    title: 'The First Brolympics',
    summary: "My first app, built in Visual Basic with Visual Studio's drag-and-drop designer. It was rough, but it was a start.",
    skills: { 'Visual Basic': 1 },
    project: 'brolympics',
  },
  {
    date: '2015',
    end: '2020',
    side: 'work',
    logos: ['logos/indiana.svg', 'logos/ball-state.svg', 'logos/sigma-chi-shield.png'],
    title: 'B.S. in Mathematical Economics, Minor in Computer Science',
    skills: {},
  },
  {
    date: '2019',
    side: 'build',
    title: 'A Kaggle Competition',
    summary: 'My first go at machine learning: a Kaggle competition during my degree.',
    skills: { Python: 1, Statistics: 1, 'Machine learning': 1 },
    project: 'kaggle',
  },
  {
    date: '2019',
    side: 'work',
    position: anthemIntern,
    title: 'Summer Internship',
    summary: "A summer on Anthem's process consulting team, the year before I joined it.",
    skills: { 'Data analysis': 1, Excel: 1 },
    project: 'anthem-internship',
  },
  {
    date: '2020',
    side: 'work',
    position: anthem,
    title: 'New Website Launch',
    summary: 'Helped launch a new website built in C#: I ran the analytics that found what was wrong with it, and wrote the queries that helped fix it.',
    skills: { 'C#': 1, SQL: 1, 'Data analysis': 1 },
    project: 'anthem-website-launch',
  },
  {
    date: '2021-04',
    side: 'work',
    position: ukgConsultant,
    title: 'Customer Implementations',
    summary: 'Implemented UKG for customers in healthcare, manufacturing, and retail, up to six at a time.',
    skills: { 'Client consulting': 2, 'Project leadership': 2 },
    project: 'ukg-implementations',
  },
  {
    date: '2022-01',
    side: 'work',
    position: ukgConsultant,
    title: 'A New Training Program',
    summary: 'Developed a new training program as team lead, responsible for how 60 new consultants were trained and how they did.',
    skills: { Enablement: 3, 'Team leadership': 2, 'Project leadership': 1 },
    project: 'consultant-training',
  },
  {
    date: '2021-10',
    side: 'work',
    position: ukgConsultant,
    title: 'Mentoring New Consultants',
    summary: 'Mentored five new consultants through regular one-on-ones.',
    skills: { Mentoring: 2, Enablement: 1 },
    project: 'mentoring-consultants',
  },
  {
    date: '2022-09',
    side: 'work',
    position: ukgConsultant,
    title: 'Innovation Competition',
    summary: "An entry in UKG's internal innovation competition.",
    skills: { 'Project leadership': 1, 'Process improvement': 1 },
    project: 'innovation-competition',
  },
  {
    date: '2022-05',
    side: 'work',
    position: ukgConsultant,
    title: 'Rules of Engagement Project',
    summary: 'Defined how the consulting team works with the teams around it: who owns what, how handoffs happen, and when to escalate.',
    skills: { 'Project leadership': 1, 'Process improvement': 1 },
    project: 'rules-of-engagement',
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
    title: 'Monty Hall Simulation',
    summary: 'Simulating the Monty Hall problem to watch the odds play out.',
    skills: { Python: 1, Jupyter: 1 },
    project: 'monty-hall',
  },
  {
    date: '2021-12',
    side: 'build',
    title: 'KTC Analysis and Scraping',
    summary: 'Scraping and analyzing KeepTradeCut dynasty fantasy values.',
    skills: { Python: 1, Jupyter: 1, 'Web scraping': 2, 'Data analysis': 1, 'Data engineering': 1 },
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
    summary: 'Computer players for the Dominion board game.',
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
    title: 'Process Merging and Cleanup',
    summary: 'Overlapping business processes, mapped, merged, and documented as one.',
    skills: { 'Process improvement': 1, 'Project leadership': 1 },
    project: 'process-cleanup',
  },
  {
    date: '2023-07',
    side: 'work',
    position: ukgEngineer,
    title: 'Process Automation',
    summary: 'Found the business problems behind slow deliveries and built the solutions, cutting delivery times 30%.',
    skills: { 'Process improvement': 1, 'Project leadership': 1, Python: 1 },
    project: 'process-automation',
  },
  {
    date: '2023-10',
    side: 'work',
    position: ukgEngineer,
    title: 'Smartsheet Data Pipelines',
    summary: "Automated Python pipelines from Smartsheet's API into our BigQuery warehouse, cleaning the data along the way.",
    skills: { Python: 2, BigQuery: 2, SQL: 1, 'Data engineering': 2 },
    project: 'smartsheet-pipelines',
  },
  {
    date: '2024-01',
    side: 'work',
    position: ukgEngineer,
    title: 'Partner Onboarding Platform',
    summary: 'Led the design of the process and the product: requirements, relational data schemas, and how the microservices work together.',
    skills: { 'System design': 1, 'Data modeling': 1, 'Project leadership': 2 },
    project: 'partner-onboarding-platform',
  },
  {
    date: '2024-03',
    side: 'work',
    position: ukgEngineer,
    title: 'Analytics and Reporting in Smartsheet',
    summary: 'Reporting built on the cleaned data, so the business processes team could track its own work.',
    skills: { SQL: 1, 'Data analysis': 1 },
    project: 'smartsheet-analytics',
  },
  {
    date: '2023-03',
    end: '2024-09',
    side: 'build',
    title: 'Brolympics',
    summary: 'The 2014 idea, rebuilt as a Django app: first on a GraphQL API, then on Django REST Framework with a React front end.',
    skills: {
      Python: 2,
      Django: 3,
      GraphQL: 1,
      'Django REST Framework': 2,
      React: 2,
      JavaScript: 1,
      'Tailwind CSS': 1,
      CSS: 1,
    },
    project: 'brolympics',
  },
  {
    date: '2023-08',
    side: 'build',
    title: 'Design Patterns',
    summary: 'The classic software design patterns, implemented one by one.',
    skills: { 'Design patterns': 2, 'Object-oriented design': 1 },
    project: 'design-patterns',
  },
  {
    date: '2023-08',
    end: 'now',
    side: 'build',
    title: 'Fantasy Data Engineering & Machine Learning',
    summary: 'Data pipelines, projections, and analysis for my dynasty fantasy football league.',
    skills: { Python: 2, Jupyter: 1, 'Data analysis': 2, Statistics: 1 },
    project: 'fantasy-analysis',
  },
  {
    date: '2025-09',
    side: 'build',
    title: 'Fantasy Data Lake on GCP',
    summary:
      'Daily pipelines from Sleeper, KeepTradeCut, FantasyCalc, and nflverse into a bronze and silver data lake on Cloud Storage, run as Cloud Run jobs.',
    skills: { 'Data engineering': 3, 'Cloud Run': 2, 'Cloud Storage': 1, Polars: 2, Python: 1 },
    project: 'fantasy-analysis',
  },
  {
    date: '2026-06',
    side: 'build',
    title: 'Dynasty Value Models',
    summary:
      "Models (gradient-boosted trees and TabPFN) that project every player's next ten seasons, value them in wins above replacement, and are backtested against the market.",
    skills: { 'Machine learning': 4, Statistics: 2, Python: 1 },
    project: 'fantasy-analysis',
  },
  {
    date: '2023-12',
    side: 'build',
    title: 'GPT Image Processor',
    summary: 'A Django API that describes uploaded images with GPT, with comments and infinite scroll.',
    skills: { Python: 1, 'LLM integration': 2 },
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
    title: 'Rust Engine',
    summary: 'An Entity Component System game engine, in Rust.',
    skills: { Rust: 2, 'Entity Component Systems': 1 },
    project: 'rust-engine',
  },
  {
    date: '2024-02',
    side: 'build',
    title: 'Rune',
    summary: 'A two-player tactics game with its own client and server.',
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
    title: 'Data Structures and Algorithms',
    summary: 'Classic data structures and algorithms, worked through in Python.',
    skills: { Python: 1, Jupyter: 1, Algorithms: 2 },
    project: 'dsa',
  },
  {
    date: '2026-01',
    end: 'now',
    side: 'build',
    title: 'Agentic Brolympics Development',
    summary:
      'Brolympics built with agentic development: its own API and front end on Cloud Run, running real game days, backed by unit, API, and end-to-end tests.',
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
      'Agentic development': 3,
    },
    project: 'brolympics',
  },
  {
    date: '2025-06',
    side: 'build',
    title: 'Soulpoint AI',
    summary:
      'Data and AI for tough workflows: the strategy, the tools, and the governance that keep operations compliant and efficient. Plus the React site that tells the story.',
    skills: {
      'AI governance': 2,
      'Client consulting': 2,
      'Governance & compliance': 1,
      'Project leadership': 1,
      React: 1,
    },
    project: 'soulpoint',
  },
  {
    date: '2024-09',
    side: 'work',
    position: barnesThornburg,
    title: 'Unified Cloud Data Platform',
    summary:
      "Led the firm's first: migrating off on-premises systems onto a Microsoft Fabric lakehouse on Azure, with data from 15+ systems in one lake.",
    skills: {
      'Microsoft Fabric': 3,
      'Fabric migration': 4,
      'Lakehouse architecture': 3,
      'Capacity planning': 2,
      'Data engineering': 3,
      'Project leadership': 2,
      'Power BI': 1,
      Azure: 2,
      PySpark: 2,
      SQL: 2,
    },
    project: 'bt-data-platform',
  },
  {
    date: '2024-12',
    side: 'work',
    position: barnesThornburg,
    title: 'Fabric Utilities and CI/CD Library',
    summary: 'A reusable package and pipelines that standardized ingestion, transformation, and business logic across dev and production.',
    skills: { 'Microsoft Fabric': 2, 'CI/CD': 2, 'Engineering standards': 2, 'Data engineering': 2, Python: 2 },
    project: 'fabric-utilities',
  },
  {
    date: '2025-03',
    side: 'work',
    position: barnesThornburg,
    title: 'SharePoint MCP Server',
    summary: 'A prototype that lets an LLM work in SharePoint: creating lists, updating columns, editing data, and pulling insights.',
    skills: { MCP: 2, 'Agentic development': 1, 'LLM integration': 1, Python: 1 },
    project: 'sharepoint-mcp',
  },
  {
    date: '2025-06',
    side: 'work',
    position: barnesThornburg,
    title: 'Unstructured Data, Normalized with AI',
    summary: 'An automated pipeline using Power Automate and ChatGPT to turn media-licensing and option-agreement contracts into structured data, verified by attorneys.',
    skills: { 'LLM integration': 2, 'Governance & compliance': 1, 'AI governance': 1, 'Project leadership': 1 },
    project: 'contract-ai-pipeline',
  },
  {
    date: '2025-09',
    side: 'work',
    position: barnesThornburg,
    title: 'Software Architecture and Design',
    summary: "The firm's data engineering, Python, and SQL standards: the documentation, the code-review checklists, and the architecture behind them.",
    skills: { 'Engineering standards': 2, 'System design': 2, 'Lakehouse architecture': 1 },
    project: 'engineering-standards',
  },
  {
    date: '2025-12',
    side: 'work',
    position: barnesThornburg,
    title: 'Team Management',
    summary: 'Managed the data team, employees and contractors: assigning the work and owning the backlog to keep delivery visible.',
    skills: { 'Team leadership': 3, Mentoring: 1, 'Project leadership': 1 },
    project: 'data-team-lead',
  },
  {
    date: '2026-03',
    side: 'work',
    position: lilly,
    title: 'SOX-Compliant CI/CD for Microsoft Fabric',
    summary:
      "Lilly's first GitHub-native CI/CD for Fabric: a workspace per branch, parameterized deployments, and the approval gates and segregation of duties that brought it under SOX.",
    skills: {
      'CI/CD': 3,
      'Governance & compliance': 3,
      'Microsoft Fabric': 3,
      'GitHub Actions': 2,
      'Project leadership': 2,
      'Data engineering': 1,
    },
    project: 'lilly-fabric-cicd',
  },
  {
    date: '2026-03',
    side: 'work',
    position: lilly,
    title: 'Cash Flow Statement Automation',
    summary:
      'Re-architected a highly manual quarterly process on Fabric, with a semantic model that rolls up by day, month, and year and drills to document level.',
    skills: {
      'Semantic models': 3,
      'Power BI': 3,
      'Microsoft Fabric': 2,
      'Data modeling': 2,
      'Data engineering': 2,
      'Lakehouse architecture': 1,
      'Project leadership': 2,
    },
    project: 'cash-flow-statement',
  },
  {
    date: '2026-03',
    side: 'work',
    position: lilly,
    title: 'Agentic Development Enablement',
    summary: 'Brought Claude Code, Fabric Git integration, and VS Code together so developers work locally with context-aware agents.',
    skills: { 'Agentic development': 3, Enablement: 2, 'Microsoft Fabric': 1, Mentoring: 1 },
    project: 'agentic-fabric-development',
  },
  {
    date: '2026-03',
    side: 'work',
    position: lilly,
    title: 'SDLC Development',
    summary: 'Bringing software development principles and a real development lifecycle to the data teams.',
    skills: { Enablement: 2, 'Engineering standards': 1, 'Team leadership': 1, 'CI/CD': 1, Mentoring: 1 },
    project: 'data-sdlc',
  },
  {
    date: '2026-03',
    side: 'work',
    position: lilly,
    title: 'Architectural Redesign',
    summary: 'Refining our medallion architecture, moving toward a data mesh, and drawing clear lines between analytics engineers, data engineers, and analysts.',
    skills: { 'Lakehouse architecture': 2, 'Capacity planning': 1, 'Microsoft Fabric': 1, 'Data engineering': 1, 'System design': 1 },
    project: 'lilly-architecture',
  },
  {
    date: '2026-09',
    end: 'now',
    side: 'build',
    title: 'This Site',
    summary: 'A static React site on GitHub Pages, reading a Django API on Cloud Run.',
    skills: {
      'Agentic development': 3,
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

// The timeline, oldest first. Entries are sorted by date here, so they can be
// written in any order above (a job's projects together, say); ones from the
// same month keep the order they're written in. A bare year sorts before the
// months of that year.
export const journey = [...entries].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))

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
