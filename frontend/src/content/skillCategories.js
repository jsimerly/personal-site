// The kinds of skill the basket sorts itself into at the end of the journey,
// in display order: what I lead with first, in the words the people hiring
// for it use. A skill not listed here lands in "Other".
export const skillCategories = [
  {
    name: 'Leadership',
    skills: [
      'Project leadership',
      'Team leadership',
      'Enablement',
      'Client consulting',
      'Mentoring',
      'Engineering standards',
      'Process improvement',
    ],
  },
  {
    name: 'Microsoft Fabric',
    skills: ['Microsoft Fabric', 'Lakehouse architecture', 'Fabric migration', 'Semantic models', 'Governance & compliance'],
  },
  { name: 'AI', skills: ['Agentic development', 'Machine learning', 'LLM integration', 'MCP', 'AI governance'] },
  {
    name: 'Data engineering',
    skills: [
      'Data engineering',
      'Data modeling',
      'PySpark',
      'BigQuery',
      'Polars',
      'Statistics',
      'Data analysis',
      'Jupyter',
      'Web scraping',
      'Excel',
      'Tableau',
    ],
  },
  {
    name: 'Cloud and DevOps',
    skills: ['CI/CD', 'Azure', 'GitHub Actions', 'Cloud Run', 'Cloud Storage', 'AWS', 'Docker', 'Kubernetes'],
  },
  { name: 'Languages', skills: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Rust', 'Java', 'C++', 'C#', 'Visual Basic'] },
  {
    name: 'Backend',
    skills: ['Django', 'Django REST Framework', 'GraphQL', 'Postgres', 'Firebase Auth', 'Networking'],
  },
  { name: 'Frontend', skills: ['React', 'Tailwind CSS', 'Vite', 'HTML', 'CSS'] },
  { name: 'Testing', skills: ['pytest', 'Playwright'] },
  {
    name: 'Fundamentals',
    skills: [
      'System design',
      'Algorithms',
      'Data structures',
      'Object-oriented design',
      'Design patterns',
      'Entity Component Systems',
      'Game AI',
    ],
  },
  { name: 'Mindset', skills: ['Curious'] },
]

// The skills that stick around: what I lead with today, named the way the
// people hiring for it name it. Once the basket sorts itself at the end of
// the journey, these stay bright and lead their rows; every other skill fades
// back (still there, still clickable, just quiet). Add or remove one here to
// change what stands out.
export const lastingSkills = [
  // Leadership
  'Project leadership',
  'Team leadership',
  'Enablement',
  'Client consulting',
  'Mentoring',
  'Engineering standards',
  // Microsoft Fabric
  'Microsoft Fabric',
  'Lakehouse architecture',
  'Fabric migration',
  'Semantic models',
  'Governance & compliance',
  // AI
  'Agentic development',
  'Machine learning',
  'LLM integration',
  'MCP',
  'AI governance',
  // Data engineering
  'Data engineering',
  'Data modeling',
  'PySpark',
  // Cloud and DevOps
  'CI/CD',
  'Azure',
  // Languages
  'Python',
  'SQL',
  // Fundamentals and mindset
  'System design',
  'Curious',
]
