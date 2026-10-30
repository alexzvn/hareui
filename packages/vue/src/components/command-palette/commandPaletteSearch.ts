import type { FuseResultMatch } from 'fuse.js'

/** A run of text, marked when the search matched it. */
export type HighlightSegment = {
  text: string
  isMatch: boolean
}

// Each `<mark>` pair of an HTML highlight is 13 characters; a cut-off start keeps up to that many characters per match
// before the first one, so a match deep inside a long description stays visible once the line is truncated.
const KEPT_PER_MATCH = 13

const ELLIPSIS = '...'

const isWordChar = (char: string | undefined) => !!char && /[\p{L}\p{M}\p{N}_]/u.test(char)

const toWordStart = (chars: string[], cut: number) => {
  let start = cut
  if (isWordChar(chars[cut - 1])) {
    while (start < chars.length && isWordChar(chars[start])) start++
    if (start === chars.length) return cut
  }

  while (start < chars.length && !isWordChar(chars[start])) start++

  return start
}

const getMinMatchLength = ({ searchTerm, useTokenSearch }: HighlightOptions) => {
  if (!useTokenSearch) return searchTerm.length

  const tokens = searchTerm.match(/[\p{L}\p{M}\p{N}_]+/gu) ?? []
  if (tokens.length === 0) return searchTerm.length

  return Math.min(...tokens.map((token) => token.length))
}

const toSegments = (match: FuseResultMatch, minLength: number): HighlightSegment[] => {
  const value = match.value ?? ''
  const segments: HighlightSegment[] = []
  let start = 0

  for (const [from, to] of match.indices) {
    // A single matched character is noise, not a highlight.
    if (from === to) continue

    const end = to + 1
    if (from > start) segments.push({ text: value.slice(start, from), isMatch: false })
    segments.push({ text: value.slice(from, end), isMatch: end - from >= minLength })
    start = end
  }

  if (start < value.length) segments.push({ text: value.slice(start), isMatch: false })

  return segments
}

const truncateStart = (segments: HighlightSegment[]): HighlightSegment[] => {
  const firstMatch = segments.findIndex((segment) => segment.isMatch)
  if (firstMatch <= 0) return segments

  const kept = KEPT_PER_MATCH * segments.filter((segment) => segment.isMatch).length

  const before = Array.from(
    segments
      .slice(0, firstMatch)
      .map((segment) => segment.text)
      .join(''),
  )

  if (before.length <= kept) return segments

  const start = toWordStart(before, before.length - kept)
  const head = { text: ELLIPSIS + before.slice(start).join(''), isMatch: false }

  return [head, ...segments.slice(firstMatch)]
}

type HighlightOptions = {
  searchTerm: string
  useTokenSearch?: boolean
}

/**
 * The matched runs of one field (`key`) of a search result, or `undefined` when the field didn't match.
 * Plain text is kept as is (rendered as text, never as HTML).
 */
export const getHighlight = (
  matches: readonly FuseResultMatch[] | undefined,
  { key, ...options }: HighlightOptions & { key: string },
): HighlightSegment[] | undefined => {
  const match = matches?.find((candidate) => candidate.key === key)
  if (!match) return undefined

  const segments = toSegments(match, getMinMatchLength(options))
  if (!segments.some((segment) => segment.isMatch)) return undefined

  return truncateStart(segments)
}
