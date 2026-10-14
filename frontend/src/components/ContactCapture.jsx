import { IconArrowRight, IconCircleCheck, IconMail } from '@tabler/icons-react'
import { useEffect, useId, useRef, useState } from 'react'
import { profile } from '../content/profile'
import { apiPost } from '../lib/api'
import { reachable } from '../lib/contact'
import { buttonStyles } from './ui'

// "Work with me" in one motion: the button turns into a field for an email or
// a phone number, already focused, and Enter sends it to the API
// (api/apps/contact), which stores it and emails me. There is no second
// button to find and no form to fill out.
//
// - `source` says which one it was ('hero' or 'footer'), so I can see which
//   converts.
// - `open` shows the field from the start, where the visitor has already
//   scrolled to it; there the field isn't focused, so the page doesn't jump.
const PROBLEMS = {
  typo: "That doesn't look like an email or a phone number.",
  busy: "That's a few tries in a row. Give it a little while, then try again.",
  down: "Couldn't send that just now. Try again in a moment.",
}

export default function ContactCapture({ source, open: startOpen = false }) {
  const { prompt, promise, thanks } = profile.contact
  const [open, setOpen] = useState(startOpen)
  const [value, setValue] = useState('')
  const [decoy, setDecoy] = useState('')
  const [status, setStatus] = useState('idle')
  const [problem, setProblem] = useState(null)
  const id = useId()
  const button = useRef(null)
  const closed = useRef(false)

  // Back to the button after Escape, with focus on it, not lost on the page.
  useEffect(() => {
    if (!open && closed.current) button.current?.focus()
  }, [open])

  const submit = async (event) => {
    event.preventDefault()
    if (!reachable(value)) {
      setProblem(PROBLEMS.typo)
      return
    }
    setStatus('sending')
    setProblem(null)
    try {
      await apiPost('/api/contact/', { contact: value.trim(), source, website: decoy })
      setStatus('sent')
    } catch (error) {
      setStatus('idle')
      if (error.status === 400) setProblem(error.body?.contact?.[0] ?? PROBLEMS.typo)
      else if (error.status === 429) setProblem(PROBLEMS.busy)
      else setProblem(PROBLEMS.down)
    }
  }

  if (status === 'sent') {
    return (
      <p role="status" className="inline-flex min-h-11 items-center gap-2 font-medium text-zinc-100">
        <IconCircleCheck size={20} aria-hidden="true" className="text-work" />
        {thanks}
      </p>
    )
  }

  if (!open) {
    return (
      <button ref={button} type="button" onClick={() => setOpen(true)} className={`${buttonStyles.primary} cursor-pointer`}>
        <IconMail size={16} aria-hidden="true" />
        Work with me
      </button>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="relative w-full sm:w-80">
      <div className="flex items-center rounded-full border border-zinc-600 bg-zinc-900 p-1 pl-4 transition-colors focus-within:border-zinc-300">
        <label htmlFor={id} className="sr-only">
          {prompt}
        </label>
        <input
          id={id}
          type="text"
          autoComplete="email"
          // Opened by a click, the cursor is already in the field.
          autoFocus={!startOpen}
          placeholder={prompt}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && !startOpen && !value) {
              closed.current = true
              setOpen(false)
            }
          }}
          aria-invalid={Boolean(problem)}
          aria-describedby={`${id}-note`}
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={status === 'sending'}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60"
        >
          <IconArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
      <p id={`${id}-note`} role={problem ? 'alert' : undefined} className={`mt-2 pl-4 text-left text-xs ${problem ? 'text-build' : 'text-zinc-500'}`}>
        {status === 'sending' ? 'Sending…' : (problem ?? promise)}
      </p>
      {/* A decoy no person sees or reaches; bots fill in every field. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={decoy}
        onChange={(event) => setDecoy(event.target.value)}
        className="absolute -left-[9999px] size-px opacity-0"
      />
    </form>
  )
}
