// The work the home page leads with, right under the first screen: the
// biggest outcomes first, Fabric work ahead of the rest. Each card opens its
// project page (src/projects), which is where the full case study lives.
//
// - `project` is the project's slug.
// - `org` is where it was done.
// - `outcome` is the one line a skimmer takes away: what changed, with a
//   number where there is one.
// - `live` (optional) is a path on this site to try it.
export const selectedWork = [
  {
    project: 'lilly-fabric-cicd',
    org: 'Eli Lilly',
    outcome:
      "Lilly's first GitHub-native CI/CD for Microsoft Fabric, with the approval gates and segregation of duties that brought deployments under SOX.",
  },
  {
    project: 'bt-data-platform',
    org: 'Barnes & Thornburg',
    outcome: "The firm's first unified cloud data platform: 15+ systems moved off on-premises servers into one Fabric lake.",
  },
  {
    project: 'cash-flow-statement',
    org: 'Eli Lilly',
    outcome:
      'A highly manual quarterly process, re-architected and automated, projected to save thousands of hours at full rollout.',
  },
  {
    project: 'fantasy-analysis',
    org: 'Personal project',
    outcome:
      "Ten-season projections for every NFL player on a data lake I run, backtested on seasons the model never saw and measured against the market.",
    live: '/fantasy-analysis',
  },
]
