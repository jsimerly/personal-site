// My photo, cropped to a circle in a thin ring. Until there's a photo, the
// ring holds my initials and a marked spot.
export default function ProfilePhoto({ src, name, className = '' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div className={`shrink-0 rounded-full border border-zinc-700 p-1.5 ${className}`}>
      {src ? (
        <img
          src={`${import.meta.env.BASE_URL}${src}`}
          alt={name}
          className="aspect-square size-full rounded-full bg-zinc-900 object-cover"
        />
      ) : (
        <div className="flex aspect-square size-full flex-col items-center justify-center rounded-full bg-zinc-900 text-center">
          <span aria-hidden="true" className="text-5xl font-semibold tracking-tight text-zinc-600">
            {initials}
          </span>
          <span className="mt-2 text-xs text-zinc-500">[Your photo]</span>
        </div>
      )}
    </div>
  )
}
