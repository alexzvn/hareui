// Markdown keeps character references (`&amp;`, `&#169;`) as written. An HTML renderer leaves them to the browser's
// parser, but text and attributes set from script are never decoded, so the renderer decodes them itself.
const NAMED_ENTITIES: Record<string, string> = {
  AMP: '&',
  GT: '>',
  LT: '<',
  QUOT: '"',
  amp: '&',
  apos: "'",
  bull: '•',
  colon: ':',
  copy: '©',
  deg: '°',
  euro: '€',
  ge: '≥',
  gt: '>',
  hellip: '…',
  laquo: '«',
  larr: '←',
  ldquo: '“',
  le: '≤',
  lsquo: '‘',
  lt: '<',
  mdash: '—',
  middot: '·',
  nbsp: '\u00A0',
  ndash: '–',
  ne: '≠',
  plusmn: '±',
  quot: '"',
  raquo: '»',
  rarr: '→',
  rdquo: '”',
  reg: '®',
  rsquo: '’',
  times: '×',
  trade: '™',
}

const ENTITY = /&(?:#(\d{1,7})|#[Xx]([\dA-Fa-f]{1,6})|([A-Za-z][\dA-Za-z]{1,31}));/g
const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel'])
const SCHEME = /^([A-Za-z][\d+.A-Za-z-]*):/

// URL parsers drop tabs and newlines anywhere, so `java\tscript:` still runs as `javascript:`.
const URL_IGNORED = /[\t\n\r]/g

// Code point 0, surrogates and values past U+10FFFF decode to the replacement character, as in HTML.
const toCharacter = (codePoint: number) => {
  const isValid =
    codePoint > 0 && codePoint <= 0x10ffff && (codePoint < 0xd800 || codePoint > 0xdfff)

  return isValid ? String.fromCodePoint(codePoint) : '\uFFFD'
}

// URL parsers also strip C0 control characters and spaces from both ends before reading the scheme.
const trimControls = (value: string) => {
  let start = 0
  let end = value.length
  while (start < end && value.charCodeAt(start) <= 0x20) start++
  while (end > start && value.charCodeAt(end - 1) <= 0x20) end--

  return value.slice(start, end)
}

/** Decodes numeric character references and the common named ones; unknown names stay as written. */
export const decodeEntities = (text: string) => {
  if (!text.includes('&')) return text

  return text.replaceAll(ENTITY, (reference: string, ...captures: (string | undefined)[]) => {
    const [decimal, hex, name = ''] = captures
    if (decimal) return toCharacter(Number(decimal))
    if (hex) return toCharacter(Number.parseInt(hex, 16))

    return NAMED_ENTITIES[name] ?? reference
  })
}

/**
 * The URL a link or image may point to. Relative URLs and `http`, `https`, `mailto` and `tel` pass; any other scheme
 * (`javascript:`, `data:`, `vbscript:`, …) returns `undefined`, also when hidden behind character references,
 * control characters or tabs.
 */
export const toSafeUrl = (url: string): string | undefined => {
  const decoded = trimControls(decodeEntities(url))
  const scheme = SCHEME.exec(decoded.replaceAll(URL_IGNORED, ''))?.[1]
  if (scheme && !SAFE_SCHEMES.has(scheme.toLowerCase())) return undefined

  return decoded
}
