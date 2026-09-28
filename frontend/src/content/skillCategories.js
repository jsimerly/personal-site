// The kinds of skill the basket sorts itself into at the end of the journey,
// in display order. A skill not listed here lands in "Other".
export const skillCategories = [
  { name: 'Languages', skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Rust', 'Java'] },
  { name: 'Frontend', skills: ['React', 'Tailwind CSS', 'Vite', 'HTML', 'CSS'] },
  {
    name: 'Backend',
    skills: ['Django', 'Django REST Framework', 'GraphQL', 'Postgres', 'Firebase Auth', 'Networking'],
  },
  {
    name: 'Data',
    skills: ['Data analysis', 'Jupyter', 'Polars', 'Web scraping', 'Statistics', 'Excel', 'Tableau', 'LLM APIs'],
  },
  {
    name: 'Cloud and DevOps',
    skills: ['Cloud Run', 'Cloud Storage', 'AWS', 'Docker', 'Kubernetes', 'GitHub Actions'],
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
]
