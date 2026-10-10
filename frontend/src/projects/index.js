import { lazy } from 'react'

// Every project on the site, in gallery order: everything I've built, big or
// small, shipped or not. Each one gets a card and a page at /projects/<slug>,
// and every card on the home page's timeline links to its page. The page is
// built from these fields unless the project has its own `Page` (for
// interactive or data-backed projects, which read from the API under
// /api/<slug>/). `hidden` keeps a project routable but out of the gallery.
// `links.explore` is a path on this site to try it.
//
// `tags` double as the project's skills: on the home page, picking a skill
// finds the projects tagged with it, so use the same names as the journey.
// `featured` projects are the favorites shown there before anything is
// picked (the first three), and win ties when something is.
//
// The work projects are a first pass from the resume. Ones where the copy
// goes past what the resume says carry a TODO(jacob) to check.
const repo = (name) => `https://github.com/jsimerly/${name}`

export const projects = [
  {
    slug: 'brolympics',
    name: 'Brolympics',
    kind: 'personal',
    year: '2023 to now',
    featured: true,
    summary:
      "Runs a weekend of games for a group of friends: leagues, teams, brackets, and live standings on everyone's phone.",
    tags: ['React', 'Django REST Framework', 'Cloud Run', 'Postgres', 'Firebase Auth'],
    links: { live: 'https://brolympics.app' },
    description: [
      'Commissioners set up a league, draw teams, and schedule the events. On game day, players check in, report their scores, and follow brackets and standings live.',
      "It's a mobile-first React app on a Django REST Framework API, running on Cloud Run with Postgres and Firebase Auth, and backed by unit, API, and end-to-end test suites.",
    ],
  },
  {
    slug: 'fantasy-analysis',
    name: 'Fantasy Data Engineering & Machine Learning',
    kind: 'personal',
    year: '2021 to now',
    featured: true,
    summary: 'A data lake, projection models, and a live dynasty value board for my fantasy football leagues.',
    tags: ['Python', 'Data engineering', 'Polars', 'Machine learning', 'Statistics', 'Cloud Run', 'Cloud Storage', 'Jupyter'],
    links: { explore: '/fantasy-analysis', github: 'https://github.com/jsimerly/fantasy-analysis' },
    description: [
      'Scheduled Cloud Run jobs pull league, market, and NFL stats data from Sleeper, KeepTradeCut, FantasyCalc, and nflverse into a bronze layer on Cloud Storage, then model it into clean dimensions and facts. A Cloud Workflow runs the whole pipeline in dependency order every day.',
      "On top of that sit projection models, gradient-boosted trees and TabPFN, that forecast every player's next ten seasons, value them in wins above replacement for each of my leagues, and measure the market against them. Every model is backtested on seasons it never saw.",
    ],
  },
  {
    slug: 'ecs-engine',
    name: 'ECS Engine',
    kind: 'personal',
    year: '2024',
    summary: 'A lightweight, dependency-free Entity Component System for building games in Python.',
    tags: ['Python', 'Entity Component Systems'],
    links: { github: 'https://github.com/jsimerly/ecs_engine', live: 'https://pypi.org/project/ecs-engine/' },
    description: [
      'An Entity Component System keeps the state of a game in plain components and the behavior in systems that run over them, which is how engines handle thousands of things moving at once. This one has the baseline pieces (entities, components, systems, and an admin to run them), an entity builder for repeatable setup, singleton components for state no single entity owns, and an event bus for systems to talk through.',
      'Components live in pools backed by a sparse set, so a query over entities walks contiguous memory and the CPU cache stays warm. Events are queued and processed in batches so they never invalidate that cache mid-update. It ships on PyPI as ecs-engine.',
    ],
  },
  {
    slug: 'ankicode',
    name: 'AnkiCode',
    kind: 'personal',
    year: '2024',
    summary: 'An Anki-style spaced repetition system for keeping LeetCode practice fresh.',
    tags: ['Python', 'Algorithms'],
    links: { github: 'https://github.com/jsimerly/ankicode' },
    description: [
      "Anki works for vocabulary because it shows you a card right before you'd forget it. AnkiCode does the same for LeetCode: each problem comes back on a schedule set by how it went last time, so the ones you struggle with return soon and the ones you've nailed drift out for weeks.",
      "It's a small Python API that tracks the problems, the attempts, and when each one is due.",
    ],
  },
  {
    slug: 'personal-site',
    name: 'This Site',
    kind: 'personal',
    year: '2026 to now',
    summary: 'A static React site on GitHub Pages, reading a Django API on Cloud Run.',
    tags: ['React', 'JavaScript', 'Vite', 'Tailwind CSS', 'Python', 'Django REST Framework', 'GitHub Actions', 'Playwright'],
    links: { github: repo('personal-site') },
    description: [
      "The site you're reading. The front end is a static React app on GitHub Pages, so the first paint never waits on a server; anything backed by data, like the fantasy analysis section, reads a read-only Django REST Framework API on Cloud Run, which scales to zero between visits.",
      'Three test lanes gate every merge: pytest on the API, Vitest on the components, and Playwright running the production build on a phone and a laptop against the real API. A merge deploys the API first, then the site, from GitHub Actions. Built with Claude Code.',
    ],
  },
  {
    slug: 'soulpoint',
    name: 'Soulpoint AI',
    kind: 'personal',
    year: '2025',
    summary:
      'Data and AI for tough workflows: the strategy, the tools, and the governance that keep operations compliant and efficient. Plus the React site that tells the story.',
    tags: ['AI governance', 'Governance & compliance', 'Client consulting', 'React'],
    links: {},
    // TODO(jacob): what Soulpoint is and who it serves, in your words.
    description: [
      'Soulpoint AI is the consulting practice I started in 2025 for teams that want data and AI in workflows where compliance matters: the strategy for where it helps, the tooling to put it in place, and the governance that keeps operations efficient and defensible.',
      'The site is a React app I built to tell that story.',
    ],
  },
  {
    slug: 'dsa',
    name: 'Data Structures and Algorithms',
    kind: 'personal',
    year: '2024',
    summary: 'Classic data structures and algorithms, worked through in Python.',
    tags: ['Python', 'Jupyter', 'Algorithms'],
    links: { github: repo('dsa') },
    description: [
      'The classics, implemented from scratch in a notebook rather than imported: the data structures, the sorts and searches, and the graph algorithms, each one written out, tested on small cases, and compared against what the library versions do.',
    ],
  },
  {
    slug: 'rune',
    name: 'Rune',
    kind: 'personal',
    year: '2024',
    summary: 'A two-player tactics game with its own client and server.',
    tags: ['Python', 'Networking'],
    links: { github: repo('Rune_Server') },
    // TODO(jacob): what the game plays like once the draft is over.
    description: [
      'A two-player game split into a client and a server, both in Python. The server runs on asyncio and websockets and handles accounts, matchmaking, and a draft phase before each match; the client renders the menus, the draft, and the game itself, and keeps its own state in sync over the wire.',
      'It grew out of an earlier prototype with a hex map, characters, and abilities, and most of the work went into the networking: what the server owns, what the client is allowed to assume, and how both recover when a message is late.',
    ],
  },
  {
    slug: 'rust-engine',
    name: 'Rust Engine',
    kind: 'personal',
    year: '2024',
    summary: 'An Entity Component System game engine, in Rust.',
    tags: ['Rust', 'Entity Component Systems'],
    links: {},
    description: [
      'The ideas from my Python ECS, taken to Rust for the speed and for what the borrow checker teaches about ownership. Components in contiguous storage, systems that borrow exactly what they read and write, and a few benchmarks to see how far the Python version was from the metal.',
    ],
  },
  {
    slug: 'gpt-image-processor',
    name: 'GPT Image Processor',
    kind: 'personal',
    year: '2023',
    summary: 'A Django API that describes uploaded images with GPT, with comments and infinite scroll.',
    tags: ['Python', 'Django REST Framework', 'LLM integration'],
    links: { github: repo('gpt-image-processor') },
    description: [
      "Built as a take-home task. Upload an image, as a file or a base64 string, and the API sends it to GPT's vision model and stores the description it comes back with. Images and their comments page through Django REST Framework's pagination, so a client can scroll them endlessly, and anyone can leave a comment on an image.",
      'The analysis runs in a Celery worker with Redis as the broker, so the client gets its response right away and the description fills in when the model is done.',
    ],
  },
  {
    slug: 'design-patterns',
    name: 'Design Patterns',
    kind: 'personal',
    year: '2023',
    summary: 'The classic software design patterns, implemented one by one.',
    tags: ['Design patterns', 'Object-oriented design'],
    links: { github: repo('design-patterns') },
    description: [
      'The Gang of Four patterns, each written out in Python with a small example of the problem it solves: adapter, builder, facade, factory, iterator, mediator, observer, prototype, proxy, singleton, state, and strategy. Writing them by hand is how I learned to spot which one a messy piece of code is trying to be.',
    ],
  },
  {
    slug: 'sih-sportsbook',
    name: 'Stuck in High School Sportsbook',
    kind: 'personal',
    year: '2022',
    summary: "Turns fantasy football projections into betting lines and over/unders for my league's matchups.",
    tags: ['Python', 'Django', 'JavaScript', 'HTML', 'CSS', 'AWS', 'Docker'],
    links: { github: repo('SIHSportsbook') },
    description: [
      "The project that got me out of tutorial hell. It pulls projections and win rates from Sleeper, turns them into moneylines, spreads, and over/unders, and lets everyone in the league bet on each week's matchups and climb a leaderboard.",
      'Friends playtested it and liked it, but Sleeper stopped supporting its projections API before the whole league got in. It still taught me how to take something from a script to a deployed app: Django, Docker, and AWS.',
    ],
  },
  {
    slug: 'dominion-ai',
    name: 'Dominion AI',
    kind: 'personal',
    year: '2022',
    summary: 'Computer players for the Dominion board game.',
    tags: ['Python', 'Game AI'],
    links: { github: repo('DominionAI') },
    // TODO(jacob): how the players decide (rules, search, learning?) and which won.
    description: [
      'Dominion is a deck-building game, so a player has to value cards it may not draw for several turns. These are my computer players for it, with a game module to run them against each other many times over and compare how they do.',
    ],
  },
  {
    slug: 'dominion',
    name: 'Dominion',
    kind: 'personal',
    year: '2022',
    summary: 'A Python implementation of the Dominion board game, kept as the table for my own players.',
    tags: ['Python', 'Object-oriented design'],
    links: { github: repo('dominion') },
    description: [
      "A fork of an open-source Python implementation of Dominion, the deck-building card game, with the base game, a console player, and a script that pits two players against each other. I kept it as the table my own players sat at, and reading its card, effect, and turn classes was a good lesson in modeling a game's rules in objects.",
    ],
  },
  {
    slug: 'ktc-analysis',
    name: 'KTC Analysis and Scraping',
    kind: 'personal',
    year: '2021',
    summary: 'Scraping and analyzing KeepTradeCut dynasty fantasy values.',
    tags: ['Python', 'Jupyter', 'Web scraping', 'Data engineering', 'Data analysis'],
    links: { github: repo('KTC-Analysis-and-Scraping') },
    description: [
      "KeepTradeCut crowdsources what dynasty fantasy players are worth. This scraper pulls those values into a SQLite database, and a notebook digs through them: how values move through a season, which positions hold value with age, and where the crowd disagrees with itself. It's the seed of the fantasy analysis project.",
    ],
  },
  {
    slug: 'monty-hall',
    name: 'Monty Hall Simulation',
    kind: 'personal',
    year: '2021',
    summary: 'Simulating the Monty Hall problem to watch the odds play out.',
    tags: ['Python', 'Jupyter'],
    links: { github: repo('Monty-Hall-Python') },
    description: [
      'Three doors, one car, and a host who opens a goat. Should you switch? A notebook that plays the game thousands of times and plots the win rate for switching against staying, which settles the argument faster than the algebra does: switching wins two times in three.',
    ],
  },
  {
    slug: 'odin-project',
    name: 'The Odin Project',
    kind: 'personal',
    year: '2021',
    summary: "Projects from The Odin Project's web development curriculum.",
    tags: ['HTML', 'CSS', 'JavaScript'],
    links: { github: repo('OdinRepo') },
    description: [
      "Where I learned the front end: the exercises and projects from The Odin Project's curriculum, in plain HTML, CSS, and JavaScript, from a recipes site through the CSS exercises. No frameworks yet, which is the point.",
    ],
  },
  {
    slug: 'kaggle',
    name: 'A Kaggle Competition',
    kind: 'personal',
    year: '2019',
    summary: 'My first go at machine learning: a Kaggle competition during my degree.',
    tags: ['Python', 'Jupyter', 'Statistics'],
    links: {},
    // TODO(jacob): which competition, what you tried, and how it placed.
    description: [
      "My first real machine learning, done in 2019 while I was still at Ball State: a Kaggle competition, which means someone else's dataset, a leaderboard, and no way to hide. Cleaning the data, engineering features, fitting a model, and submitting predictions in Python.",
    ],
  },
  {
    slug: 'cpp',
    name: 'Teaching Myself C++',
    kind: 'personal',
    year: '2013',
    summary: 'My first code: the basics of C++, learned on my own.',
    tags: ['C++'],
    links: {},
    description: [
      'Where it started. In 2013 I taught myself the basics of C++ from books and tutorials: variables, loops, functions, and enough about pointers to be dangerous. Nothing came of the programs, but the habit of figuring things out on my own did.',
    ],
  },

  // Work, newest first.
  {
    slug: 'lilly-fabric-cicd',
    name: 'SOX-Compliant CI/CD for Microsoft Fabric',
    kind: 'work',
    year: '2026',
    featured: true,
    summary:
      "Lilly's first GitHub-native CI/CD pipeline for Microsoft Fabric, with a workspace per branch and the approval gates that brought deployments under SOX.",
    tags: ['CI/CD', 'Governance & compliance', 'Microsoft Fabric', 'Data engineering', 'GitHub Actions', 'Project leadership', 'Azure'],
    links: {},
    description: [
      'Lilly had no GitHub-native way to ship Microsoft Fabric. I architected and launched the first one: a workspace per branch so every feature is isolated, parameterized deployments through fabric-cicd, and GitHub Actions authenticating as a service principal to promote code from feature branches through to production.',
      "Then I brought it under SOX: branch protection, approval gates, and a split between who writes and who deploys, which leaves a fully replayable deployment history. Microsoft's own Fabric team had not seen that done in an enterprise environment.",
    ],
  },
  {
    slug: 'cash-flow-statement',
    name: 'Cash Flow Statement Automation',
    kind: 'work',
    year: '2026',
    summary: 'Re-architected a highly manual quarterly process, with a semantic model that rolls up by day, month, and year and drills to document level.',
    tags: ['Semantic models', 'Power BI', 'Microsoft Fabric', 'Data modeling', 'Data engineering', 'Lakehouse architecture', 'Project leadership'],
    links: {},
    description: [
      "The internal reporting team built the Cash Flow Statement by hand every quarter. I re-architected and delivered the platform behind it, automating most of that process; at full rollout it's projected to save thousands of hours.",
      "The Power BI semantic model was redesigned too, so the statement rolls up by day, month, and year and drills through to company code and document level, analysis the previous model couldn't support.",
    ],
  },
  {
    slug: 'agentic-fabric-development',
    name: 'Agentic Fabric Development',
    kind: 'work',
    year: '2026',
    summary: 'Brought Claude Code, Fabric Git integration, and VS Code together so developers work locally with context-aware agents.',
    tags: ['Agentic development', 'Enablement', 'Microsoft Fabric'],
    links: {},
    description: [
      "Fabric development happened in the browser, one notebook at a time, with no way for an agent to see the whole codebase. I brought Claude Code, Fabric's Git integration, and VS Code together so developers work locally, with agents that have the full repo as context. Both the speed and the quality of what shipped went up.",
    ],
  },
  {
    slug: 'data-sdlc',
    name: 'SDLC for Data Teams',
    kind: 'work',
    year: '2026',
    summary: 'Bringing software development principles and a real development lifecycle to the data teams.',
    tags: ['Enablement', 'Engineering standards', 'Team leadership', 'CI/CD'],
    links: {},
    description: [
      'Data teams often ship without the habits software teams take for granted. Across several teams at Lilly I introduce those habits and the lifecycle around them: branches, reviews, tests, and releases that can be traced, taught by working alongside the developers rather than by memo.',
    ],
  },
  {
    slug: 'lilly-architecture',
    name: 'Architectural Redesign',
    kind: 'work',
    year: '2026',
    summary: 'Refining the medallion architecture, moving toward a data mesh, and drawing clear lines between analytics engineers, data engineers, and analysts.',
    tags: ['Lakehouse architecture', 'Capacity planning', 'Data engineering', 'System design', 'Microsoft Fabric'],
    links: {},
    description: [
      'Enterprise architecture and engineering guidance across multiple teams: refining the medallion architecture so each layer has one job, driving adoption of a data mesh model so domains own their data, and defining where the work of analytics engineers, data engineers, and analysts begins and ends.',
    ],
  },
  {
    slug: 'bt-data-platform',
    name: 'Unified Cloud Data Platform',
    kind: 'work',
    year: '2024 to 2026',
    summary: "Led the firm's first: moving off on-premises systems onto Microsoft Fabric and Azure, with data from 15+ systems in one lake.",
    tags: ['Microsoft Fabric', 'Fabric migration', 'Lakehouse architecture', 'Capacity planning', 'Project leadership', 'Data engineering', 'Power BI', 'Azure', 'PySpark', 'SQL'],
    links: {},
    description: [
      "Barnes & Thornburg's first unified cloud data platform. I led the migration from legacy on-premises systems to Microsoft Fabric and Azure, architecting the platform and consolidating data from more than 15 systems into one data lake that the whole firm could report from in Power BI, and sizing the Fabric capacity it runs on.",
    ],
  },
  {
    slug: 'fabric-utilities',
    name: 'Fabric Utilities and CI/CD Library',
    kind: 'work',
    year: '2024 to 2026',
    summary: 'A reusable package and pipelines that standardized ingestion, transformation, and business logic across dev and production.',
    tags: ['Microsoft Fabric', 'Engineering standards', 'Data engineering', 'CI/CD', 'Python'],
    links: {},
    description: [
      "The team's reusable Microsoft Fabric utilities package and the CI/CD pipelines around it. It standardized how ingestion, transformation, and business logic were written, and kept the internal Python packages version-synced and deployment-ready across dev and production, so a change moved through environments the same way every time.",
    ],
  },
  {
    slug: 'sharepoint-mcp',
    name: 'SharePoint MCP Server',
    kind: 'work',
    year: '2025',
    summary: 'A prototype that lets an LLM work in SharePoint: creating lists, updating columns, editing data, and pulling insights.',
    tags: ['MCP', 'Agentic development', 'LLM integration', 'Python'],
    links: {},
    description: [
      "A prototype Model Context Protocol server that extends an LLM into SharePoint. From a conversation, the model can create lists, update columns, edit data, and generate insights from what's there, with the server deciding what it's allowed to touch.",
    ],
  },
  {
    slug: 'contract-ai-pipeline',
    name: 'Contract Data, Normalized with AI',
    kind: 'work',
    year: '2025',
    summary: 'An automated pipeline that turns media-licensing and option-agreement contracts into structured data, verified by attorneys.',
    tags: ['LLM integration', 'Governance & compliance', 'AI governance', 'Project leadership'],
    links: {},
    description: [
      'Media-licensing and option-agreement contracts arrived as unstructured documents. I designed an automated pipeline on Power Automate and ChatGPT that reads them into structured data, integrated with SharePoint and Microsoft Copilot, with attorneys verifying the output before anything downstream trusts it.',
    ],
  },
  {
    slug: 'engineering-standards',
    name: 'Engineering Standards and Architecture',
    kind: 'work',
    year: '2025',
    summary: "The firm's data engineering, Python, and SQL standards: the documentation, the code-review checklists, and the architecture behind them.",
    tags: ['Engineering standards', 'Lakehouse architecture', 'System design', 'Python', 'SQL'],
    links: {},
    description: [
      "Established the firm's data engineering, Python, and SQL development standards, and wrote the documentation and code-review checklists that made them stick. Standards are the quiet half of architecture: they're what keeps a platform built by five people from looking like five platforms.",
    ],
  },
  {
    slug: 'data-team-lead',
    name: 'Leading the Data Team',
    kind: 'work',
    year: '2025 to 2026',
    summary: 'Managed the data team, employees and contractors: assigning the work and owning the backlog to keep delivery visible.',
    tags: ['Team leadership', 'Mentoring'],
    links: {},
    description: [
      'Organized and assigned the work across a five-person data team of employees and contractors, owning the Kanban board and the backlog so that what was coming, what was blocked, and what had shipped stayed visible to stakeholders.',
    ],
  },
  {
    slug: 'partner-onboarding-platform',
    name: 'Partner Onboarding Platform',
    kind: 'work',
    year: '2024',
    summary: 'Led the design of the process and the product: requirements, relational data schemas, and how the microservices work together.',
    tags: ['Project leadership', 'System design', 'Data modeling', 'Process improvement'],
    links: {},
    description: [
      "Led the design of both the process and the product for UKG's partner onboarding platform: detailing the requirements, establishing the frameworks, designing the relational data schemas, and orchestrating how the microservices interact.",
    ],
  },
  {
    slug: 'smartsheet-analytics',
    name: 'Analytics and Reporting in Smartsheet',
    kind: 'work',
    year: '2024',
    summary: 'Reporting built on the cleaned data, so the business processes team could track its own work.',
    tags: ['SQL', 'Data analysis'],
    links: {},
    // TODO(jacob): what the reports covered and who used them.
    description: [
      'Once the pipelines had made the data trustworthy, the reporting followed: SQL-backed analytics and Smartsheet reports that the business processes team used to see where its work stood and where it was slowing down.',
    ],
  },
  {
    slug: 'smartsheet-pipelines',
    name: 'Smartsheet Data Pipelines',
    kind: 'work',
    year: '2023',
    summary: "Automated Python pipelines from Smartsheet's API into our BigQuery warehouse, cleaning the data along the way.",
    tags: ['Data engineering', 'Python', 'BigQuery', 'SQL'],
    links: {},
    description: [
      "Automated data pipelines in Python from Smartsheet's API into our BigQuery data warehouse, cleaning and transforming the data on the way in so that the analytics built on it could be trusted.",
    ],
  },
  {
    slug: 'process-automation',
    name: 'Process Automation',
    kind: 'work',
    year: '2023',
    summary: 'Found the business problems behind slow deliveries and built the solutions, cutting delivery times 30%.',
    tags: ['Process improvement', 'Python'],
    links: {},
    description: [
      'Working cross-functionally with end users to find the business challenges behind slow deliveries, then building tailored solutions and drafting the business proposals to fund them. Delivery times fell 30%, enough to meet our SLAs.',
    ],
  },
  {
    slug: 'process-cleanup',
    name: 'Process Merging and Cleanup',
    kind: 'work',
    year: '2023',
    summary: 'Overlapping business processes, mapped, merged, and documented as one.',
    tags: ['Process improvement'],
    links: {},
    // TODO(jacob): which processes, and what merging them changed.
    description: [
      "My first project as a software engineer on the business processes team: mapping how the work actually flowed through several overlapping processes, merging the duplicates, retiring what no one used, and documenting the one process that remained.",
    ],
  },
  {
    slug: 'ukg-implementations',
    name: 'Customer Implementations',
    kind: 'work',
    year: '2021 to 2022',
    summary: 'Implemented UKG for customers in healthcare, manufacturing, and retail, up to six at a time.',
    tags: ['Client consulting', 'Project leadership'],
    links: {},
    description: [
      "Managed up to six customer SaaS implementations at once, for customers in healthcare, manufacturing, and retail. The job was translating what each customer needed into working technical configuration, and keeping six timelines honest at the same time.",
    ],
  },
  {
    slug: 'consultant-training',
    name: 'A New Training Program',
    kind: 'work',
    year: '2022',
    summary: 'Developed a new training program as team lead, responsible for how 60 new consultants were trained and how they did.',
    tags: ['Enablement', 'Team leadership', 'Project leadership'],
    links: {},
    description: [
      'Promoted to team lead, I developed a new training program for incoming consultants and was responsible for how 60 of them were trained and for their overall success once they were on customer work.',
    ],
  },
  {
    slug: 'mentoring-consultants',
    name: 'Mentoring New Consultants',
    kind: 'work',
    year: '2021 to 2022',
    summary: 'Mentored five new consultants through regular one-on-ones.',
    tags: ['Mentoring', 'Enablement'],
    links: {},
    description: [
      'Regular one-on-ones with five new consultants: working through their implementations with them, and the habits that make a consultant someone customers trust.',
    ],
  },
  {
    slug: 'rules-of-engagement',
    name: 'Rules of Engagement',
    kind: 'work',
    year: '2022',
    summary: 'Defined how the consulting team works with the teams around it: who owns what, how handoffs happen, and when to escalate.',
    tags: ['Process improvement', 'Client consulting'],
    links: {},
    // TODO(jacob): what the project actually covered.
    description: [
      'A project to write down how the consulting team works with the teams around it: who owns what, how handoffs happen, and when to escalate. The kind of rules that save a hundred arguments later.',
    ],
  },
  {
    slug: 'innovation-competition',
    name: 'Innovation Competition',
    kind: 'work',
    year: '2022',
    summary: "An entry in UKG's internal innovation competition.",
    tags: ['Process improvement'],
    links: {},
    // TODO(jacob): what you pitched and how it went.
    description: [
      "An entry in UKG's internal innovation competition: a pitch and a prototype for improving how implementations run, built alongside the day job.",
    ],
  },
  {
    slug: 'anthem-website-launch',
    name: 'New Website Launch',
    kind: 'work',
    year: '2020',
    summary: 'Helped launch a new website built in C#: I ran the analytics that found what was wrong with it, and wrote the queries that helped fix it.',
    tags: ['C#', 'SQL', 'Data analysis'],
    links: {},
    description: [
      'Anthem was launching a new website built in C#. I ran the analytics on it after launch, found what was going wrong and where, and wrote the SQL queries that helped the team fix it.',
    ],
  },
  {
    slug: 'anthem-internship',
    name: 'Summer Internship at Anthem',
    kind: 'work',
    year: '2019',
    summary: "A summer on Anthem's process consulting team, the year before I joined it.",
    tags: ['Data analysis', 'Excel'],
    links: {},
    // TODO(jacob): what the internship involved.
    description: [
      "A summer internship on Anthem's process consulting team, the year before I joined it full time: learning how a large health insurer runs its operations, and doing the analysis behind the process improvements the team recommended.",
    ],
  },
  {
    slug: 'example',
    name: 'Example Project',
    kind: 'personal',
    year: '2026',
    hidden: true,
    summary: 'A template for data-backed projects. Fetches a list from the API and renders it.',
    tags: [],
    links: {},
    Page: lazy(() => import('./example/ExamplePage.jsx')),
  },
]

export const listedProjects = projects.filter((project) => !project.hidden)

export const KIND_LABELS = { work: 'Work', school: 'School', personal: 'Personal' }
