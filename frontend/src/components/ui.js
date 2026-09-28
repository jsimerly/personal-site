// Shared class strings, so every button and section label looks the same.
// Buttons are fully rounded; tags and filter chips use small corners.
const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500'

export const buttonStyles = {
  primary: `${buttonBase} bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200`,
  secondary: `${buttonBase} border border-zinc-300 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-900`,
}

export const sectionLabel = 'text-xs font-semibold tracking-widest text-zinc-500 uppercase'

export const textLink =
  'font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-100'
