// How each side of the journey looks, wherever an entry shows up. Class names
// are spelled out in full so Tailwind can find them. On a phone every card
// sits right of the spine; from md up, work is left and builds are right, and
// from lg up a center column is kept free for the basket.
export const SIDES = {
  work: {
    newSkill: 'bg-work/15 text-work',
    dot: 'bg-work',
    column: 'md:col-start-1',
  },
  build: {
    newSkill: 'bg-build/15 text-build',
    dot: 'bg-build',
    column: 'md:col-start-2 lg:col-start-3',
  },
}
