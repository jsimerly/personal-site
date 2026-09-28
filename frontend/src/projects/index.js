import { lazy } from 'react'

// Every project on the site, in gallery order. Each one gets a card and a
// page at /projects/<slug>. The page is built from these fields unless the
// project has its own `Page` (for interactive or data-backed projects, which
// read from the API under /api/<slug>/). `hidden` keeps a project routable
// but out of the gallery.
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
    name: 'Fantasy Analysis',
    kind: 'personal',
    year: '2021 to now',
    featured: true,
    summary: 'Data pipelines, projections, and analysis for my dynasty fantasy football league.',
    tags: ['Python', 'Polars', 'Cloud Storage', 'Jupyter'],
    links: { github: 'https://github.com/jsimerly/fantasy-analysis' },
  },
  {
    slug: 'ecs-engine',
    name: 'ECS Engine',
    kind: 'personal',
    year: '2024',
    featured: true,
    summary: 'A lightweight, dependency-free Entity Component System for building games in Python.',
    tags: ['Python', 'Game architecture'],
    links: { github: 'https://github.com/jsimerly/ecs_engine' },
  },
  {
    slug: 'ankicode',
    name: 'AnkiCode',
    kind: 'personal',
    year: '2024',
    summary: 'An Anki-style spaced repetition system for keeping LeetCode practice fresh.',
    tags: ['Python'],
    links: { github: 'https://github.com/jsimerly/ankicode' },
  },
  {
    slug: 'work-project',
    name: '[A project from work]',
    kind: 'career',
    year: '[Year]',
    summary: '[What it was, what you did, and what changed because of it.]',
    tags: ['[Tech]', '[Tech]'],
    links: {},
  },
  {
    slug: 'example',
    name: 'Example project',
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

export const KIND_LABELS = { career: 'Career', personal: 'Personal' }
