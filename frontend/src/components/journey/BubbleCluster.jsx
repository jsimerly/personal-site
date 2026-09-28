import { useMemo, useState } from 'react'
import { skillCategories } from '../../content/skillCategories'
import { SORTED_COLORS, bubbleColors, bubbleFontPx, sortedFontPx } from './bubble'
import { packBubbles } from './packBubbles'
import { rowProgress, sortBubbles } from './sortBubbles'

// The desktop basket: a loose cloud of word bubbles that rides at the middle
// of the screen while the timeline scrolls. Bubbles grow with their points,
// drift aside as others join, and bob gently on their own.
//
// Past the end of the timeline, the cloud sorts itself into labeled rows by
// kind of skill, tied to the scroll (`sortProgress`, 0 to 1): rows assemble
// one after another, each label fading in as its bubbles arrive, and it all
// runs backward if you scroll up. As a row lands, its bubbles stop bobbing
// and settle into an easier-to-read size and a single purple.
//
// Timing: in the cloud, neighbors make room right away, so a fast scroll
// never leaves it scrunched up, and only a newly collected bubble waits
// (`popDelay`) for its flying chip to land. While sorting, positions follow
// the scroll with just enough easing to stay smooth.

const FONT = (px) => `500 ${px}px "Inter Variable", ui-sans-serif, system-ui, sans-serif`
const MOVE_MS = 450
const FOLLOW_MS = 140
const LABEL_SLIDE_PX = 16
// Faint lines between the kinds of skill once sorted. Set to false for none.
const SHOW_DIVIDERS = true
let measuringContext

// Width of a word at a font size, measured with the real font when the
// browser can, estimated otherwise.
function textWidth(text, px) {
  measuringContext ??= document.createElement('canvas').getContext('2d')
  if (!measuringContext) return text.length * px * 0.56
  measuringContext.font = FONT(px)
  return measuringContext.measureText(text).width
}

// A stable per-skill number, so each bubble bobs on its own rhythm.
function seed(text) {
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 997
  return hash / 997
}

const mix = (from, to, t) => from + (to - from) * t

const EMPTY_CLOUD = { bubbles: null, width: 0, layout: packBubbles([]) }

export default function BubbleCluster({ totals, sortProgress, popDelay, width, sortedWidth }) {
  const bubbles = useMemo(
    () =>
      totals.map((skillTotal) => {
        const { skill } = skillTotal
        // Full size, unless a long name wouldn't fit the column at that size.
        const naturalWidth = textWidth(skill, 10) / 10 + 1.4
        const font = Math.min(bubbleFontPx(skillTotal.points), (width - 4) / naturalWidth)
        const rowFont = sortedFontPx(skillTotal.points)
        return {
          key: skill,
          total: skillTotal,
          font,
          w: textWidth(skill, font) + font * 1.4,
          h: font * 1.9,
          rowFont,
          rowW: textWidth(skill, rowFont) + rowFont * 1.4,
          rowH: rowFont * 1.9,
        }
      }),
    [totals, width],
  )

  // Each new cloud starts from where the bubbles were in the last one, so it
  // drifts instead of reshuffling. (Updating state during render when the
  // input changes is React's pattern for "remember the previous".)
  const [cloud, setCloud] = useState(EMPTY_CLOUD)
  let cloudLayout = cloud.layout
  if (cloud.bubbles !== bubbles || cloud.width !== width) {
    cloudLayout = packBubbles(bubbles, cloud.layout.positions, width)
    setCloud({ bubbles, width, layout: cloudLayout })
  }
  const rows = useMemo(
    () => sortBubbles(bubbles.map(({ key, rowW, rowH }) => ({ key, w: rowW, h: rowH })), skillCategories, sortedWidth),
    [bubbles, sortedWidth],
  )

  const sorting = sortProgress > 0
  const height = mix(cloudLayout.height, rows.height, rowProgress(sortProgress, 0, 1))
  const moveMs = sorting ? FOLLOW_MS : MOVE_MS

  return (
    <div
      data-basket="desktop"
      className="sticky transition-[top] ease-out"
      style={{ top: `calc(50vh - ${height / 2 + 12}px)`, transitionDuration: `${moveMs}ms` }}
    >
      <p
        className="relative z-1 text-center text-xs font-semibold tracking-widest text-zinc-500 uppercase"
        style={{ opacity: 1 - Math.min(1, sortProgress * 4) }}
      >
        {/* Its own background, so the timeline's spine doesn't run through it. */}
        <span className="bg-zinc-950 px-2 py-0.5">Skills</span>
      </p>
      {totals.length === 0 ? (
        <p className="mt-3 text-center text-sm text-zinc-600">Scroll, and skills will jump in here.</p>
      ) : (
        <ul
          className="relative mt-3 transition-[height] ease-out"
          style={{ height, transitionDuration: `${moveMs}ms` }}
        >
          {sorting &&
            SHOW_DIVIDERS &&
            rows.dividers.map(({ section, y }) => (
              <li
                key={`divider-${section}`}
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 border-t border-zinc-800"
                style={{
                  width: rows.width,
                  opacity: rowProgress(sortProgress, section, rows.sections),
                  transform: `translate(${-rows.width / 2}px, ${y}px)`,
                }}
              />
            ))}
          {sorting &&
            rows.labels.map(({ name, section, x, y }) => {
              const arrived = rowProgress(sortProgress, section, rows.sections)
              return (
                <li
                  key={`label-${name}`}
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 text-xs font-semibold tracking-widest whitespace-nowrap text-zinc-400 uppercase"
                  style={{
                    opacity: arrived,
                    transform: `translate(${x - LABEL_SLIDE_PX * (1 - arrived)}px, calc(${y}px - 50%))`,
                  }}
                >
                  {name}
                </li>
              )
            })}
          {bubbles.map(({ key, total: skillTotal, ...size }) => {
            const inCloud = cloudLayout.positions.get(key)
            const inRow = rows.positions.get(key)
            const t = sorting ? rowProgress(sortProgress, inRow.section, rows.sections) : 0
            const x = mix(inCloud.x, inRow.x, t)
            const y = mix(inCloud.y, inRow.y, t)
            const w = mix(size.w, size.rowW, t)
            const h = mix(size.h, size.rowH, t)
            const font = mix(size.font, size.rowFont, t)
            // Past halfway to its row, a bubble stops bobbing and turns purple.
            const settled = t > 0.5
            const rhythm = seed(key)
            return (
              <li
                key={key}
                data-basket-skill={key}
                title={key}
                className={`absolute top-1/2 left-1/2 transition-transform ease-out motion-reduce:animate-none motion-reduce:transition-none ${
                  settled ? '' : 'animate-float'
                }`}
                style={{
                  transform: `translate(${x - w / 2}px, ${y - h / 2}px)`,
                  transitionDuration: `${moveMs}ms`,
                  animationDuration: `${3.2 + rhythm * 2.4}s`,
                  animationDelay: `${-rhythm * 4}s`,
                }}
              >
                <span
                  className="flex animate-pop items-center justify-center rounded-full font-medium whitespace-nowrap text-zinc-50 transition-all duration-400 [animation-fill-mode:backwards] motion-reduce:animate-none motion-reduce:transition-none"
                  style={{
                    width: w,
                    height: h,
                    fontSize: `${font}px`,
                    ...(settled ? SORTED_COLORS : bubbleColors(skillTotal)),
                    animationDelay: `${popDelay}ms`,
                  }}
                >
                  {key}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
