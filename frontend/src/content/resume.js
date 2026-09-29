// The resume, as on the PDF (profile.resumePdf once it's in public/), newest
// first. When one changes, change the other to match.

export const experience = [
  {
    company: 'Eli Lilly',
    note: 'contract through Brooksource',
    roles: [
      {
        title: 'Senior Data Engineer',
        start: 'Mar 2026',
        end: 'Current',
        highlights: [
          "Architected and launched Lilly's first GitHub-native CI/CD pipeline for Microsoft Fabric, building workspace-per-branch environment isolation, parameterized deployments via fabric-cicd, and SPN-authenticated GitHub Actions promoting code from feature branches through to production.",
          "Brought Fabric deployments under SOX compliance via branch protection, approval gates, and author/deployer segregation of duties; producing a fully replayable deployment history, an implementation that Microsoft's own Fabric team had not seen in an enterprise environment.",
          'Re-architected and delivered the Cash Flow Statement platform for the internal reporting team, automating a highly manual quarterly process projected to save thousands of hours at full rollout.',
          "Redesigned the Cash Flow Statement semantic model to enable daily/monthly/yearly rollups and drill-throughs to company code and document level, surfacing analysis the prior model couldn't support.",
          'Enabled local, agentic Fabric development by integrating Claude Code, Fabric Git integration, and VSCode; introducing local development using full-repo context-aware agents, improving both development speed and quality.',
          'Provide enterprise architecture and engineering guidance across multiple teams; refining our medallion architecture, introducing software development principles to devs, driving adoption of a data mesh model, and defining role boundaries between analytics engineers, data engineers, and analysts.',
        ],
      },
    ],
  },
  {
    company: 'Barnes & Thornburg',
    roles: [
      {
        title: 'Data Engineer',
        start: 'Sep 2024',
        end: 'Mar 2026',
        highlights: [
          "Led the firm's first unified cloud data platform, architecting the migration from legacy on-premises systems to Microsoft Fabric and Azure, consolidating data from 15+ systems into our data lake.",
          "Built and maintained the team's reusable Microsoft Fabric utilities package and CI/CD pipelines; standardizing ingestion, transformation, and business logic, and keeping internal Python packages version-synced and deployment-ready across dev and production.",
          "Established the firm's data engineering, Python, and SQL development standards, authoring documentation and code-review checklists.",
          'Organized and assigned work across a five-person data team, owning the Kanban board and backlog to keep delivery visible to stakeholders.',
          'Prototyped an MCP (Model Context Protocol) server extending LLM capabilities into SharePoint; automating list creation, column updates, data edits, and insight generation.',
          'Designed an automated AI pipeline using Power Automate and ChatGPT for media-licensing and option-agreement contract processing, integrating SharePoint, Microsoft Copilot, and attorney verification workflows.',
        ],
      },
    ],
  },
  {
    company: 'UKG (Ultimate Kronos Group)',
    roles: [
      {
        title: 'Software Engineer - Business Processes',
        start: 'Jan 2023',
        end: 'Jul 2024',
        highlights: [
          'Led the design of the process and product for our partner onboarding platform, detailing requirements, establishing frameworks, designing relational data schemas, and orchestrating microservice interactions.',
          "Automated data pipelines using Python, our BigQuery data warehouse, and Smartsheets' API that cleaned and transformed our data to improve data quality for analytics.",
          'Collaborated cross-functionally with end users to identify business challenges, develop tailored solutions, and drafted business proposals, reducing delivery times 30% to meet SLAs.',
        ],
      },
      {
        title: 'Solutions Consultant (Team Lead)',
        start: 'Jan 2021',
        end: 'Dec 2022',
        highlights: [
          'Promoted to Team Lead, where I was responsible for the training and the overall success of 60 new consultants.',
          'Managed up to 6 customer SaaS implementations simultaneously, where I was responsible for translating customer needs to working technical solutions.',
        ],
      },
    ],
  },
]

export const skills = [
  {
    group: 'Languages & Libraries',
    items: ['Python', 'TypeScript', 'SQL', 'Spark', 'PySpark', 'Polars', 'Pandas', 'Django', 'DRF', 'React'],
  },
  {
    group: 'Data Engineering',
    items: ['Microsoft Fabric', 'Data Lakes', 'Data & Semantic Modeling', 'Orchestration', 'Data Architecture'],
  },
  { group: 'Azure', items: ['OneLake', 'Spark', 'Key Vaults'] },
  { group: 'Google Cloud', items: ['Cloud Run', 'Pub/Sub', 'Cloud Storage', 'Firebase Auth'] },
  {
    group: 'Developer Tools',
    items: ['Git', 'GitHub Actions', 'CI/CD', 'Claude Code', 'MCP', 'Docker', 'VSCode', 'CLI', 'Jira'],
  },
]

export const education = [
  {
    school: 'Ball State University',
    location: 'Muncie, IN',
    degree: 'Bachelor of Science in Mathematical Economics',
    minor: 'Minor in Computer Science',
    start: '2016',
    end: '2020',
  },
]

export const personalProjects = [
  {
    name: 'Fantasy Football Data Engineering, Machine Learning, and Analysis',
    links: [{ label: 'GitHub', href: 'https://github.com/jsimerly/fantasy-analysis' }],
    highlights: [
      'Engineered and automated data pipelines using Cloud Run, Google Cloud Storage, BigQuery, BeautifulSoup and SQLAlchemy to scrape and store player market values from 3+ sources into a GCS and later convert to a curated silver layer for analysis and ML.',
      "Built gradient-boosted models (XGBoost/LightGBM) to project players' career points above replacement, discounted by contention window, for intrinsic dynasty-league valuations.",
    ],
  },
  {
    name: 'Fullstack Sports Management Web App',
    links: [{ label: 'Live site', href: 'https://brolympics.app' }],
    highlights: [
      'Built a multi-tenant competition platform on Cloud Run and Cloud SQL supporting 20+ concurrent clients on independent devices, with real-time score synchronization and state updates across simultaneous events.',
      'Implemented complex tournament logic including partial round-robin matchmaking algorithms, multi-factor scoring systems, and custom tiebreaker resolution for event management.',
    ],
  },
  {
    name: 'ECS Framework (Game Engine Architecture)',
    links: [
      { label: 'GitHub', href: 'https://github.com/jsimerly/ecs_engine' },
      { label: 'PyPI', href: 'https://pypi.org/project/ecs-engine/' },
    ],
    highlights: [
      'Architected and implemented a custom Entity Component System framework in python, achieving improved CPU cache performance through data-oriented design and contiguous memory layout.',
      'Engineered a pub/sub event system that preserves cache coherency by queuing and batch processing events, preventing cache invalidation during critical system updates.',
    ],
  },
]
