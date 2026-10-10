// The kinds of skill the basket sorts itself into at the end of the journey,
// in display order: what I lead with first, in the words the people hiring
// for it use. A skill not listed here lands in "Other".
//
// Skills and kinds are written in title case, the way a label reads (Data
// Engineering, Power BI), except a name its makers write lowercase (pytest).
export const skillCategories = [
  {
    name: 'Leadership',
    skills: [
      'Project Leadership',
      'Team Leadership',
      'Enablement',
      'Client Consulting',
      'Mentoring',
      'Engineering Standards',
      'Process Improvement',
    ],
  },
  {
    name: 'Microsoft Fabric',
    skills: [
      'Microsoft Fabric',
      'Lakehouse Architecture',
      'Fabric Migration',
      'Power BI',
      'Semantic Models',
      'Governance & Compliance',
      'Capacity Planning',
    ],
  },
  { name: 'AI', skills: ['Agentic Development', 'Machine Learning', 'LLM Integration', 'MCP', 'AI Governance'] },
  {
    name: 'Data Engineering',
    skills: [
      'Data Engineering',
      'Data Modeling',
      'PySpark',
      'BigQuery',
      'Polars',
      'Data Analysis',
      'Jupyter',
      'Web Scraping',
      'Excel',
      'Tableau',
    ],
  },
  {
    name: 'Cloud & DevOps',
    skills: [
      'Git',
      'GitHub',
      'GitHub Actions',
      'CI/CD',
      'Google Cloud',
      'Azure',
      'Cloud Run',
      'Cloud Storage',
      'Docker',
      'AWS',
      'Kubernetes',
    ],
  },
  { name: 'Languages', skills: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Rust', 'Java', 'C++', 'C#', 'Visual Basic'] },
  // Everything behind the apps I've shipped, in one quiet row.
  {
    name: 'Full Stack',
    skills: [
      'Django',
      'Django REST Framework',
      'GraphQL',
      'Postgres',
      'Firebase Auth',
      'Networking',
      'React',
      'Tailwind CSS',
      'Vite',
      'HTML',
      'CSS',
      'pytest',
      'Playwright',
    ],
  },
  {
    name: 'Fundamentals',
    skills: [
      'System Design',
      'Algorithms',
      'Data Structures',
      'Object-Oriented Design',
      'Design Patterns',
      'Entity Component Systems',
      'Game AI',
    ],
  },
  {
    name: 'Math & Economics',
    skills: ['Statistics', 'Linear Algebra', 'Econometrics', 'Probability', 'Calculus', 'Economics'],
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
  'Project Leadership',
  'Team Leadership',
  'Enablement',
  'Client Consulting',
  'Mentoring',
  'Engineering Standards',
  // Microsoft Fabric
  'Microsoft Fabric',
  'Lakehouse Architecture',
  'Fabric Migration',
  'Power BI',
  'Semantic Models',
  'Governance & Compliance',
  'Capacity Planning',
  // AI
  'Agentic Development',
  'Machine Learning',
  'LLM Integration',
  'MCP',
  'AI Governance',
  // Data Engineering
  'Data Engineering',
  'Data Modeling',
  'PySpark',
  // Cloud & DevOps: how everything I build ships, and where my own projects run
  'Git',
  'GitHub',
  'GitHub Actions',
  'CI/CD',
  'Google Cloud',
  'Azure',
  // Languages
  'Python',
  'SQL',
  // Fundamentals, math, and mindset
  'System Design',
  'Statistics',
  'Linear Algebra',
  'Curious',
]
