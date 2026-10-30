import type { BundledLanguage } from 'shiki'

import type { CodeBlockHighlightRange, CodeBlockThemes, CodeBlockToken } from './CodeBlock.types'

/** Language ids rendered as plain text without loading the highlighter. */
const PLAIN_LANGS = new Set(['text', 'txt', 'plain', 'plaintext'])

// A final newline ends the last line rather than starting an empty one.
const trimFinalNewline = (code: string) => code.replace(/\r?\n$/, '')

/** Splits code into lines of one unstyled token each; an empty line has no tokens. */
export const toPlainLines = (code: string): CodeBlockToken[][] => {
  return trimFinalNewline(code)
    .split(/\r?\n/)
    .map((content) => (content ? [{ content }] : []))
}

const toRange = (range: CodeBlockHighlightRange): number[] => {
  if (typeof range === 'number') return [range]

  const [from, to] = range

  return Array.from({ length: Math.max(to - from + 1, 0) }, (_, index) => from + index)
}

/** Expands line numbers and inclusive `[from, to]` ranges into the set of line numbers they cover. */
export const toLineSet = (ranges: CodeBlockHighlightRange[] = []) =>
  new Set(ranges.flatMap(toRange))

/** Whether a language id is rendered without the highlighter. */
export const isPlainLang = (lang: string) => PLAIN_LANGS.has(lang.toLowerCase())

/**
 * Tokenizes code with shiki, imported on first use so it stays an optional peer. Each token carries the color
 * of both themes as `--shiki-light` / `--shiki-dark`. Rejects when shiki is missing or doesn't know `lang`.
 */
export const highlightCode = async ({
  code,
  lang,
  themes,
}: {
  code: string
  lang: string
  themes: Required<CodeBlockThemes>
}): Promise<CodeBlockToken[][]> => {
  const { codeToTokens } = await import('shiki')

  // Any id is passed on: shiki rejects one it doesn't know, and the caller falls back to plain text.
  const { tokens } = await codeToTokens(trimFinalNewline(code), {
    lang: lang as BundledLanguage,
    themes,
    defaultColor: false,
  })

  return tokens.map((line) =>
    line.map((token) => ({ content: token.content, style: token.htmlStyle })),
  )
}
