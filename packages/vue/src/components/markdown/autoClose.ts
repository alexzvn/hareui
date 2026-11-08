import type { Token } from 'marked'

/** An open emphasis or strikethrough run: its character and the markers that close it. */
type Delimiter = { char: string; marker: string }

/**
 * The URL a link or image gets while its own URL is still arriving. `toSafeUrl` rejects the scheme, so it renders
 * without one until the real URL is complete.
 */
const INCOMPLETE_URL = 'incomplete:'

// Quote markers, list markers and heading hashes that open a line: emphasis can't start inside them.
const LINE_PREFIX = /^(?:[ \t]*(?:>|[*+-][ \t]|\d{1,9}[.)][ \t]|#{1,6}[ \t]))*[ \t]*/

// A last line of only `-` or `=` turns the paragraph above it into a heading, or starts an empty list item or a rule,
// before the rest of the line arrives.
const PENDING_LINE = /^(?:[ \t]*>)*[ \t]*(?:-+|=+)[ \t]*$/

// A bare URL up to the trailing punctuation an autolink leaves out, so `**https://x.com**` still closes.
const BARE_URL = /(?:https?:\/\/|www\.)\S*?(?=[!"'),.:;?\]_*~]*(?:\s|$))/iy

const WHITESPACE = /\s/
const PUNCTUATION = /[\p{P}\p{S}]/u
const WORD_START = /[\s(<]/

// The line edges count as whitespace.
const isSpace = (char: string) => char === '' || WHITESPACE.test(char)

const isPunctuation = (char: string) => PUNCTUATION.test(char)

const runLength = (text: string, start: number) => {
  let end = start
  while (text.charAt(end) === text.charAt(start)) end++

  return end - start
}

// The index of the next run of exactly `length` backticks from `from` on, or -1.
const findBackticks = (text: string, { from, length }: { from: number; length: number }) => {
  let index = text.indexOf('`', from)
  while (index !== -1) {
    const run = runLength(text, index)
    if (run === length) return index

    index = text.indexOf('`', index + run)
  }

  return -1
}

// The index of the `)` that ends a link destination starting at `from`, balancing nested parentheses, or -1.
const findDestinationEnd = (text: string, from: number) => {
  let depth = 1
  for (let index = from; index < text.length; index++) {
    const char = text.charAt(index)
    if (char === '\\') index++
    if (char === '(') depth++
    if (char === ')') depth--
    if (depth === 0) return index
  }

  return -1
}

// The length of the bare URL starting at `index`, or 0.
const bareUrlLength = (text: string, index: number) => {
  if (index > 0 && !WORD_START.test(text.charAt(index - 1))) return 0

  BARE_URL.lastIndex = index

  return BARE_URL.exec(text)?.[0].length ?? 0
}

// The index of the innermost open run of `char`, or -1.
const lastOpener = (open: Delimiter[], char: string) => {
  let index = open.length - 1
  while (index >= 0 && open[index]?.char !== char) index--

  return index
}

// Closes the innermost open runs of `char` that a closing run matches and drops the runs opened inside them. An opener
// longer than the closer stays open with what is left, so `**a*` waits for one more `*`. False when none is open.
const closeRun = (open: Delimiter[], { char, length }: { char: string; length: number }) => {
  let opener = lastOpener(open, char)
  if (opener === -1) return false

  let remaining = length
  while (remaining > 0 && opener !== -1) {
    const marker = open[opener]?.marker ?? ''
    const unmatched = marker.length - remaining
    open.length = opener
    if (unmatched > 0) open.push({ char, marker: char.repeat(unmatched) })
    remaining -= marker.length
    opener = lastOpener(open, char)
  }

  return true
}

const closers = (open: Delimiter[]) =>
  open.reduceRight((markers, delimiter) => markers + delimiter.marker, '')

/**
 * Reads the run of `*`, `_` or `~` at `index` with CommonMark's flanking rules: it closes the matching open run, opens
 * a new one onto `open`, or is plain text. Returns where the scan continues, or -1 when the run ends the line with
 * nothing after it yet and can't close anything, so the caller drops it.
 */
const scanDelimiter = (open: Delimiter[], { text, index }: { text: string; index: number }) => {
  const char = text.charAt(index)
  const length = runLength(text, index)

  // GFM strikethrough is `~~`; a single `~` ("~5 minutes") stays text.
  if (char === '~' && length !== 2) return index + length

  const before = text.charAt(index - 1)
  const after = text.charAt(index + length)
  const isLeftFlanking =
    !isSpace(after) && (!isPunctuation(after) || isSpace(before) || isPunctuation(before))

  const isRightFlanking =
    !isSpace(before) && (!isPunctuation(before) || isSpace(after) || isPunctuation(after))

  const isUnderscore = char === '_'
  const canOpen = isLeftFlanking && (!isUnderscore || !isRightFlanking || isPunctuation(before))
  const canClose = isRightFlanking && (!isUnderscore || !isLeftFlanking || isPunctuation(after))
  if (canClose && closeRun(open, { char, length })) return index + length
  if (canOpen) open.push({ char, marker: char.repeat(Math.min(length, 3)) })
  if (!canOpen && after === '' && isSpace(before)) return -1

  return index + length
}

/**
 * Closes the inline syntax left open on the last line of streamed markdown, so it renders as it will once complete:
 * emphasis, strikethrough and code spans get their closing markers, a link or image whose URL is still arriving points
 * to `INCOMPLETE_URL`, and a marker that ends the text with nothing after it yet is dropped. A last line of only `-`
 * or `=` is dropped too, until the next line shows whether it underlines a heading. Returns `value` itself when nothing
 * is open.
 */
export const autoClose = (value: string): string => {
  const lineStart = value.lastIndexOf('\n') + 1
  if (PENDING_LINE.test(value.slice(lineStart)))
    return autoClose(value.slice(0, lineStart).trimEnd())

  const contentStart = lineStart + (LINE_PREFIX.exec(value.slice(lineStart))?.[0].length ?? 0)
  const head = value.slice(0, contentStart)
  const text = value.slice(contentStart).trimEnd()
  const open: Delimiter[] = []

  // `open.length` when each still-open `[` was read: emphasis opened after it belongs to the link text.
  const labels: number[] = []
  let index = 0
  while (index < text.length) {
    const char = text.charAt(index)
    const urlLength = bareUrlLength(text, index)
    if (char === '\\' || urlLength > 0) {
      index += Math.max(urlLength, 2)
      continue
    }

    if (char === '`') {
      const length = runLength(text, index)
      const close = findBackticks(text, { from: index + length, length })
      if (close !== -1) {
        index = close + length
        continue
      }

      // A code span still open gets closed; its opening backticks are dropped while nothing follows them.
      const isEmpty = index + length === text.length
      const code = isEmpty ? text.slice(0, index).trimEnd() : text + char.repeat(length)

      return head + code + closers(open)
    }

    if (char === '[') labels.push(open.length)

    if (char === ']' && text.charAt(index + 1) === '(' && labels.length > 0) {
      const depth = labels.pop() ?? 0
      const end = findDestinationEnd(text, index + 2)
      const label = text.slice(0, index) + closers(open.slice(depth))
      if (end === -1) return `${head}${label}](${INCOMPLETE_URL})${closers(open.slice(0, depth))}`

      // Emphasis left open inside a link's text stays text, as in CommonMark.
      open.length = depth
      index = end + 1
      continue
    }

    if (char === ']') labels.pop()

    if (char === '*' || char === '_' || char === '~') {
      const next = scanDelimiter(open, { text, index })
      if (next === -1) return head + text.slice(0, index).trimEnd() + closers(open)

      index = next
      continue
    }

    index++
  }

  if (open.length === 0) return value

  return head + text + closers(open)
}

// The innermost last block: the end of the last list item or quote, where streamed text lands.
const lastBlock = (tokens: Token[]): Token | undefined => {
  let index = tokens.length - 1
  while (tokens[index]?.type === 'space') index--

  const last = tokens[index]
  if (last?.type === 'list') return lastBlock(last.items.at(-1)?.tokens ?? [])
  if (last?.type === 'blockquote') return lastBlock(last.tokens ?? [])

  return last
}

/** Whether streamed text ends inside code or raw HTML, where markers are literal and nothing gets closed. */
export const endsInRawText = (tokens: Token[]) => {
  const type = lastBlock(tokens)?.type

  return type === 'code' || type === 'html'
}
