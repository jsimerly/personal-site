// A project's cover image, or until it has one, a gradient with its initials.
// The gradient's hue comes from the slug, so each project keeps its own color.
function hueFor(slug) {
  let hue = 0
  for (const char of slug) hue = (hue * 31 + char.charCodeAt(0)) % 360
  return hue
}

function initialsFor(name) {
  return name
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export default function ProjectCover({ project, className = '' }) {
  if (project.cover) {
    return <img src={project.cover} alt="" className={`w-full object-cover ${className}`} />
  }
  const hue = hueFor(project.slug)
  return (
    <div
      aria-hidden="true"
      className={`flex w-full items-center justify-center ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 65% 55%), hsl(${(hue + 50) % 360} 60% 38%))` }}
    >
      <span className="text-3xl font-semibold tracking-tight text-white/90">{initialsFor(project.name)}</span>
    </div>
  )
}
