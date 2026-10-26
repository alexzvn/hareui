import type { DateInputGroupSegment } from './DateInputGroup.types'

const isTimeUnitPart = (part: string) => {
  return part === 'hour' || part === 'minute' || part === 'second'
}

// The run ends at the last time unit after the hour, or at the hour itself when none follows
const timeRunEnd = (segments: DateInputGroupSegment[], hourIndex: number) => {
  for (let i = segments.length - 1; i > hourIndex; i--) {
    if (isTimeUnitPart(segments[i].part)) return i
  }

  return hourIndex
}

/**
 * reka-limitation (`shared/date/utils.ts` `getOptsByGranularity`): every granularity except
 * `'day'` always requests `timeZoneName: 'short'` from `Intl.DateTimeFormat`, even for a plain
 * (non-zoned) value. `shared/date/parser.ts` `createContentArr` drops the resulting
 * `timeZoneName` segment when there's no zone to show, but not the literal separator space
 * `Intl` inserts right before it, leaving a dangling whitespace-only segment trailing. Unlike the
 * bidi-isolation mark gap in `wrapBidiIsolate`, this one is NOT zero-width (it renders as a real
 * space), so it's stripped here before the segments reach `DateInputGroup`.
 */
export const dropDanglingTimeZoneSeparator = (segments: DateInputGroupSegment[]) => {
  const last = segments.at(-1)
  const isDangling = last?.part === 'literal' && last.value.trim() === ''

  return isDangling ? segments.slice(0, -1) : segments
}

/**
 * React Aria's `useDateFieldState` (`processSegments`) wraps the `hour`/`minute`/`second` run of a time
 * field in U+2066/U+2069 (LRI/PDI) bidi-isolation literal segments, to force LTR rendering of the time in
 * RTL locales. Reka's `shared/date/parser.ts` doesn't add these, so they're inserted here to keep the
 * segment list (and therefore the `gap-px`-driven group width) identical to HeroUI's React output.
 */
export const wrapBidiIsolate = (segments: DateInputGroupSegment[]) => {
  const open = segments.findIndex((s) => s.part === 'hour')
  if (open === -1) return segments

  const close = timeRunEnd(segments, open)

  const result = segments.slice()
  result.splice(close + 1, 0, { part: 'literal', value: '\u2069' })
  result.splice(open, 0, { part: 'literal', value: '\u2066' })

  return result
}
