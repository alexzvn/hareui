/** What a piece of JSON text is, for colouring. */
type JsonTokenType = 'key' | 'string' | 'number' | 'punctuation' | 'plain'

/** A piece of JSON text and what it is. */
type JsonToken = { type: JsonTokenType; text: string }

// A string may lack its closing quote: partial JSON arrives that way while a call's input streams
const TOKEN =
  /("(?:[^"\\]|\\.)*(?:"|$))|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])/g

// Sticky: tested at the index right after a string
const KEY_FOLLOWS = /\s*:/y
const LOOKS_LIKE_JSON = /^\s*[[{]/
const COMPACT_MAX_LENGTH = 48

/**
 * A value as JSON text. Strings stay as they are. With `isCompact`, a value that fits on one short line stays on one
 * line; anything else is indented.
 */
export const toJsonText = (value: unknown, isCompact = false) => {
  if (typeof value === 'string') return value

  const compact = JSON.stringify(value) ?? String(value)
  if (isCompact && compact.length <= COMPACT_MAX_LENGTH) return compact

  return JSON.stringify(value, null, 2) ?? compact
}

const isKeyAt = (text: string, index: number) => {
  KEY_FOLLOWS.lastIndex = index

  return KEY_FOLLOWS.test(text)
}

const toTokenType = (match: RegExpMatchArray, isKey: boolean): JsonTokenType => {
  const [, string, number] = match
  if (string !== undefined) return isKey ? 'key' : 'string'
  if (number !== undefined) return 'number'

  return 'punctuation'
}

/** Splits JSON text, complete or partial, into typed pieces. Text that doesn't start like JSON stays one plain piece. */
export const tokenizeJson = (text: string): JsonToken[] => {
  if (!LOOKS_LIKE_JSON.test(text)) return [{ type: 'plain', text }]

  const tokens: JsonToken[] = []
  let end = 0

  for (const match of text.matchAll(TOKEN)) {
    const start = match.index ?? 0
    if (start > end) tokens.push({ type: 'plain', text: text.slice(end, start) })

    end = start + match[0].length
    tokens.push({ type: toTokenType(match, isKeyAt(text, end)), text: match[0] })
  }

  if (end < text.length) tokens.push({ type: 'plain', text: text.slice(end) })

  return tokens
}
