export default function TagList({ tags, className = '' }) {
  if (!tags?.length) return null
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag, index) => (
        <li
          key={`${tag}-${index}`}
          className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
