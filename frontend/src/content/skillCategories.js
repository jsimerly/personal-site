// The kinds of skill the basket sorts itself into at the end of the journey,
// in display order. A skill not listed here lands in "Other".
export const skillCategories = [
  { name: 'Mindset', skills: ['Curious'] },
  { name: 'Languages', skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Rust', 'Java', 'C++', 'Visual Basic'] },
  { name: 'Frontend', skills: ['React', 'Tailwind CSS', 'Vite', 'HTML', 'CSS'] },
  {
    name: 'Backend',
    skills: ['Django', 'Django REST Framework', 'GraphQL', 'Postgres', 'Firebase Auth', 'Networking'],
  },
  {
    name: 'Data',
    skills: [
      'Microsoft Fabric',
      'PySpark',
      'BigQuery',
      'Data modeling',
      'Data architecture',
      'Data analysis',
      'Jupyter',
      'Polars',
      'Web scraping',
      'Statistics',
      'Excel',
      'Tableau',
    ],
  },
  { name: 'AI', skills: ['LLM APIs', 'MCP', 'Agentic development'] },
  {
    name: 'Cloud and DevOps',
    skills: ['Azure', 'CI/CD', 'Cloud Run', 'Cloud Storage', 'AWS', 'Docker', 'Kubernetes', 'GitHub Actions'],
  },
  { name: 'Testing', skills: ['pytest', 'Playwright'] },
  {
    name: 'Fundamentals',
    skills: [
      'Algorithms',
      'Data structures',
      'Object-oriented design',
      'Design patterns',
      'System design',
      'Entity Component Systems',
      'Game AI',
    ],
  },
  { name: 'Leadership', skills: ['Team leadership', 'Client consulting'] },
]
