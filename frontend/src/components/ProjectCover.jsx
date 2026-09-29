// A project's cover image, or until it has one, a flat muted color with its
// initials. The hue comes from the slug, so each project keeps its own color.
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
      style={{ backgroundColor: `oklch(0.42 0.06 ${hue})` }}
    >
      <span className="text-3xl font-semibold tracking-tight text-white/90">{initialsFor(project.name)}</span>
    </div>
  )
}
