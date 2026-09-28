// How many projects the home page shows at once.
export const SHOWN_PROJECTS = 3

// The projects to show for the picked skills: the ones tagged with the most
// of them first, then favorites (`featured`), then gallery order. With
// nothing picked, the favorites themselves. At most `limit`.
export function relevantProjects(projects, picked, limit = SHOWN_PROJECTS) {
  if (!picked.length) return projects.filter((project) => project.featured).slice(0, limit)
  return projects
    .map((project, order) => ({ project, order, hits: picked.filter((skill) => project.tags.includes(skill)).length }))
    .filter(({ hits }) => hits)
    .sort((a, b) => b.hits - a.hits || Number(Boolean(b.project.featured)) - Number(Boolean(a.project.featured)) || a.order - b.order)
    .slice(0, limit)
    .map(({ project }) => project)
}

// ['Python'] -> 'Python'; ['Python', 'React'] -> 'Python and React';
// three or more -> 'Python, React, and SQL'.
export function listOf(words) {
  if (words.length < 3) return words.join(' and ')
  return `${words.slice(0, -1).join(', ')}, and ${words.at(-1)}`
}
